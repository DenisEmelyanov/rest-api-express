const QuoteModel = require("../../common/models/Quote");
const yahooFinance = require('yahoo-finance2').default;

module.exports = {
  getAllQuotes: (req, res) => {
    const { query: filters } = req;

    QuoteModel.findAllQuotes(filters)
      .then(async (quotes) => {
        //TODO check if quote is found in DB
        if (quotes.length === 0) {
          console.warn("not found: " + filters.ticker + " " + filters.date);

          try {
            const query = filters.ticker;
            //const queryOptions = { period1: filters.date, /* ... */ };
            // use date + 1 as period2
            const nextDate = new Date(filters.date);
            nextDate.setDate(nextDate.getDate() + 1);
            const queryOptions = {
              period1: filters.date, // Use the same date for both period1 and period2
              period2: nextDate.toISOString().split('T')[0],
              interval: '1d' // Specify daily data
            };
            const result = await yahooFinance.chart(query, queryOptions);
            console.warn(result);
  
            if (result && result.quotes.length > 0) {
              //console.log(result.quotes[0]); // Access the first element (data for the specified date)
              
              // try {

              // } catch (err) {
              //   console.error(err)
              // }

              const payload = {
                ticker: result.meta.symbol,
                date: new Date(result.quotes[0].date).toISOString().split('T')[0],
                open: result.quotes[0].open,
                close: result.quotes[0].close,
                high: result.quotes[0].high,
                low: result.quotes[0].low,
                volume: result.quotes[0].volume
              };
              console.log(payload);
              QuoteModel.createQuote(payload);

              return res.status(200).json({
                status: true,
                data: payload
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

