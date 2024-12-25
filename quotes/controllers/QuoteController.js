const QuoteModel = require("../../common/models/Quote");
const yahooFinance = require('yahoo-finance2').default;
const dateFns = require('date-fns');

const eachDayOfInterval = dateFns.eachDayOfInterval;
const isWeekend = dateFns.isWeekend;
const format = dateFns.format;
const isSameDay = dateFns.isSameDay;
const parseISO = dateFns.parseISO;
const addDays = dateFns.addDays;


module.exports = {
  getAllQuotes: (req, res) => {
    const { query: filters } = req;

    if (filters.startDate === undefined && filters.endDate === undefined) {
      QuoteModel.findAllQuotes(filters)
        .then(async (quotes) => {
          // check if quote is found in DB
          if (quotes.length === 0) {
            
            try {
              // use date + 1 as period2
              const currentDate = parseISO(filters.date);
              const nextDate = addDays(currentDate, 1);
              const nextFormattedDate = format(nextDate, 'yyyy-MM-dd');
              console.warn("not found: " + filters.ticker + " " + filters.date + " " + nextFormattedDate);

              const result = await getYahooFinanceResult(filters.ticker, filters.date, nextFormattedDate);
              console.warn(result);

              if (result && result.quotes.length > 0) {
                
                const payload = saveQuotesInDB(result, quotes);
                return res.status(200).json({
                  status: true,
                  data: [payload]
                });

              } else {
                console.log(`Could not retrieve historical data for ${filters.ticker} on ${filters.date}`);
                return res.status(404).json({
                  status: false,
                  data: quotes,
                });
              }

            } catch (err) {
              console.error(`Error fetching historical data for ${filters.ticker}:`, err);

              return res.status(500).json({
                status: false,
                error: err
              });
            }
          } else {
            return res.status(200).json({
              status: true,
              data: quotes,
            });
          }
        })
        .catch((err) => {
          return res.status(500).json({
            status: false,
            error: err,
          });
        });
    }
    else {
      const { startDate, endDate, ...otherFilters } = filters;

      QuoteModel.findAllQuotesBetweenDates(startDate, endDate, otherFilters)
        .then(async (quotes) => {
          // compare the length of the quote array to determine if all quote are found in DB
          const workingDays = getWorkingDaysBetweenDates(startDate, endDate);
          console.log(quotes.length + " <---> " + workingDays);

          if (quotes.length !== workingDays) {
            const result = await getYahooFinanceResult(otherFilters.ticker, startDate, endDate);
            console.warn(result);

            const payload = saveQuotesInDB(result, quotes);
            return res.status(200).json({
              status: true,
              data: [payload]
            });
          }

          return res.status(200).json({
            status: true,
            data: quotes,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            status: false,
            error: err,
          });
        });
    }


  },


  // getAllTickers: (req, res) => {
  //   const { query: filters } = req;

  //   TransactionModel.findAllTransactionTickers(filters)
  //     .then((transactions) => {
  //       //console.log(transactions);
  //       const tickers = [];
  //       for (const transaction of transactions) {
  //         tickers.push(transaction.dataValues.ticker);
  //       }
  //       const uniqueTickers = new Set(tickers);
  //       const uniqueTickersArray = Array.from(uniqueTickers);
  //       console.log(uniqueTickersArray);

  //       return res.status(200).json({
  //         status: true,
  //         data: uniqueTickersArray,
  //       });
  //     })
  //     .catch((err) => {
  //       return res.status(500).json({
  //         status: false,
  //         error: err,
  //       });
  //     });
  // },

  // getAllGroups: (req, res) => {
  //   const { query: filters } = req;

  //   TransactionModel.findAllTransactionGroups(filters)
  //     .then((transactions) => {
  //       //console.log(transactions);
  //       const groups = [];
  //       for (const transaction of transactions) {
  //         groups.push(transaction.dataValues.group);
  //       }
  //       const uniqueGroups = new Set(groups);
  //       const uniqueGroupsArray = Array.from(uniqueGroups);
  //       console.log(uniqueGroupsArray);

  //       return res.status(200).json({
  //         status: true,
  //         data: uniqueGroupsArray,
  //       });
  //     })
  //     .catch((err) => {
  //       return res.status(500).json({
  //         status: false,
  //         error: err,
  //       });
  //     });
  // },

  // getAllYears: (req, res) => {
  //   const { query: filters } = req;

  //   TransactionModel.findAllTransactionYears(filters)
  //     .then((transactions) => {
  //       //console.log(transactions);
  //       const years = [];
  //       for (const transaction of transactions) {
  //         years.push(transaction.dataValues.year);
  //       }
  //       const uniqueYears = new Set(years);
  //       const uniqueYearsArray = Array.from(uniqueYears);
  //       console.log(uniqueYearsArray);

  //       return res.status(200).json({
  //         status: true,
  //         data: uniqueYearsArray,
  //       });
  //     })
  //     .catch((err) => {
  //       return res.status(500).json({
  //         status: false,
  //         error: err,
  //       });
  //     });
  // },

  getQuoteByDate: (req, res) => {
    const {
      params: { ticker, date },
    } = req;

    console.warn(ticker + ' ' + date);

    QuoteModel.findQuote({ ticker: ticker, date: date })
      .then((quote) => {
        return res.status(200).json({
          status: true,
          data: quote.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  createQuote: (req, res) => {
    const { body: payload } = req;
    console.warn(Object.keys(payload));
    console.warn(Object.values(payload));

    QuoteModel.createQuote(payload)
      .then((quote) => {
        return res.status(200).json({
          status: true,
          data: quote.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  updateQuote: (req, res) => {
    const {
      params: { ticker, date },
      body: payload,
    } = req;

    console.warn(Object.keys(payload));
    console.warn(Object.values(payload));

    // IF the payload does not have any keys,
    // THEN we can return an error, as nothing can be updated
    if (!Object.keys(payload).length) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Body is empty, hence can not update the quote.",
        },
      });
    }

    QuoteModel.updateQuote({ ticker: ticker, date: date }, payload)
      .then(() => {
        return QuoteModel.findQuote({ ticker: ticker, date: date });
      })
      .then((quote) => {
        return res.status(200).json({
          status: true,
          data: quote.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  deleteQuote: (req, res) => {
    const {
      params: { ticker, date },
    } = req;

    QuoteModel.deleteQuote({ ticker: ticker, date: date })
      .then((numberOfEntriesDeleted) => {
        return res.status(200).json({
          status: true,
          data: {
            numberOfQuotesDeleted: numberOfEntriesDeleted
          },
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },
};

async function getYahooFinanceResult(ticker, date1, date2) {
  const queryOptions = {
    period1: date1,
    period2: date2,
    interval: '1d'
  };
  const result = await yahooFinance.chart(ticker, queryOptions);
  return result;
}

function saveQuotesInDB(result, existingQuotes) {
  const payload = [];
  for (const quote of result.quotes) {
    const dateStr = format(new Date(quote.date), "yyyy-MM-dd");
    const ticker = result.meta.symbol;

    const existingQuote = existingQuotes.find(
      (existing) => existing.ticker === ticker && existing.date === dateStr
    );

    if (!existingQuote) {
      const payloadItem = {
        ticker: ticker,
        date: dateStr,
        open: quote.open,
        close: quote.close,
        high: quote.high,
        low: quote.low,
        volume: quote.volume
      };
      console.log(payloadItem);
  
      QuoteModel.createQuote(payloadItem);
      payload.push(payloadItem);
    } else {
      console.log(`Quote already exists in DB: ${ticker} - ${dateStr}`);
      payload.push(existingQuote);
    }
  }

  return payload;
}

function getWorkingDaysBetweenDates(startDateStr, endDateStr) {
  try {
    const startDate = parseISO(startDateStr);
    const endDate = parseISO(endDateStr);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format. Please use yyyy-MM-dd.");
    }
  
    if (endDate < startDate) {
      throw new Error("End date cannot be before start date.");
    }
  
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    console.log(allDays);

    const workingDays = allDays.filter(date => !isWeekend(date) && !isHoliday(date)).length;
    return workingDays;
  } catch (error) {
    console.error("Error calculating working days:", error.message);
    return 0; // Or throw the error if you prefer
  }
}

function isHoliday(date) {
  // Define holidays using month and day (MM-DD)
  const holidays = {
    '01-01': "New Year’s Day",
    '01-15': "Birthday of Martin Luther King, Jr.",
    '02-19': "Washington’s Birthday",
    '05-27': "Memorial Day",
    '06-19': "Juneteenth National Independence Day",
    '07-04': "Independence Day",
    '09-02': "Labor Day",
    '10-14': "Columbus Day",
    '11-11': "Veterans Day",
    '11-28': "Thanksgiving Day",
    '12-25': "Christmas Day"
  };

  const monthDay = format(date, 'MM-dd');
  //console.log(monthDay + " " + holidays.hasOwnProperty(monthDay));
  return holidays.hasOwnProperty(monthDay);
}