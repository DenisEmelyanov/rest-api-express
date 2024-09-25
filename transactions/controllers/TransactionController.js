const TransactionModel = require("../../common/models/Transaction");

module.exports = {
  getAllTransactions: (req, res) => {
    const { query: filters } = req;

    TransactionModel.findAllTransactions(filters)
      .then((transactions) => {
        return res.status(200).json({
          status: true,
          data: transactions,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  getAllTickers: (req, res) => {
    const { query: filters } = req;

    TransactionModel.findAllTransactionTickers(filters)
      .then((transactions) => {
        //console.log(transactions);
        const tickers = [];
        for (const transaction of transactions) {
          tickers.push(transaction.dataValues.ticker);
        }
        const uniqueTickers = new Set(tickers);
        const uniqueTickersArray = Array.from(uniqueTickers);
        console.log(uniqueTickersArray);

        return res.status(200).json({
          status: true,
          data: uniqueTickersArray,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  getAllGroups: (req, res) => {
    const { query: filters } = req;

    TransactionModel.findAllTransactionGroups(filters)
      .then((transactions) => {
        //console.log(transactions);
        const groups = [];
        for (const transaction of transactions) {
          groups.push(transaction.dataValues.group);
        }
        const uniqueGroups = new Set(groups);
        const uniqueGroupsArray = Array.from(uniqueGroups);
        console.log(uniqueGroupsArray);

        return res.status(200).json({
          status: true,
          data: uniqueGroupsArray,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  getAllYears: (req, res) => {
    const { query: filters } = req;

    TransactionModel.findAllTransactionYears(filters)
      .then((transactions) => {
        //console.log(transactions);
        const years = [];
        for (const transaction of transactions) {
          years.push(transaction.dataValues.year);
        }
        const uniqueYears = new Set(years);
        const uniqueYearsArray = Array.from(uniqueYears);
        console.log(uniqueYearsArray);

        return res.status(200).json({
          status: true,
          data: uniqueYearsArray,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  getTransactionById: (req, res) => {
    const {
      params: { transactionId },
    } = req;

    TransactionModel.findTransaction({ id: transactionId })
      .then((transaction) => {
        return res.status(200).json({
          status: true,
          data: transaction.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  createTransaction: (req, res) => {
    const { body: payload } = req;
    console.warn(Object.keys(payload));
    console.warn(Object.values(payload));

    TransactionModel.createTransaction(payload)
      .then((transaction) => {
        return res.status(200).json({
          status: true,
          data: transaction.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  updateTransaction: (req, res) => {
    const {
      params: { transactionId },
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
          message: "Body is empty, hence can not update the transaction.",
        },
      });
    }

    TransactionModel.updateTransaction({ id: transactionId }, payload)
      .then(() => {
        return TransactionModel.findTransaction({ id: transactionId });
      })
      .then((transaction) => {
        return res.status(200).json({
          status: true,
          data: transaction.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  deleteTransaction: (req, res) => {
    const {
      params: { transactionId },
    } = req;

    TransactionModel.deleteTransaction({ id: transactionId })
      .then((numberOfEntriesDeleted) => {
        return res.status(200).json({
          status: true,
          data: {
            numberOfTransactionsDeleted: numberOfEntriesDeleted
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
