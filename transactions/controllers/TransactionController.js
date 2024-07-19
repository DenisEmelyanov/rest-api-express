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
    console.warn("body: " + Object.keys(payload));

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

    console.warn("body: " + payload);
    console.warn(Object.keys(payload));

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

    TransactionModel.deleteTransaction({id: transactionId})
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
