const router = require("express").Router();

// Controller Imports
const TransactionController = require("./controllers/TransactionController");

// Middleware Imports
const isAuthenticatedMiddleware = require("./../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../common/middlewares/SchemaValidationMiddleware");
const CheckPermissionMiddleware = require("../common/middlewares/CheckPermissionMiddleware");

// JSON Schema Imports for payload verification
const createTransactionPayload = require("./schemas/createTransactionPayload");
const updateTransactionPayload = require("./schemas/updateTransactionPayload");
const { roles } = require("../config");

router.get(
  "/",
  //[isAuthenticatedMiddleware.check],
  TransactionController.getAllTransactions
);

router.get(
    "/tickers",
    //[isAuthenticatedMiddleware.check],
    TransactionController.getAllTickers
  );

  router.get(
    "/years",
    //[isAuthenticatedMiddleware.check],
    TransactionController.getAllYears
  );

router.get(
  "/:transactionId",
  //[isAuthenticatedMiddleware.check],
  TransactionController.getTransactionById
);

router.post(
  "/",
  [
    //isAuthenticatedMiddleware.check,
    //CheckPermissionMiddleware.has(roles.ADMIN),
    SchemaValidationMiddleware.verify(createTransactionPayload),
  ],
  TransactionController.createTransaction
);

router.patch(
  "/:transactionId",
  [
    //isAuthenticatedMiddleware.check,
    //CheckPermissionMiddleware.has(roles.ADMIN),
    SchemaValidationMiddleware.verify(updateTransactionPayload),
  ],
  TransactionController.updateTransaction
);

router.delete(
  "/:transactionId",
  //[isAuthenticatedMiddleware.check, CheckPermissionMiddleware.has(roles.ADMIN)],
  TransactionController.deleteTransaction
);

module.exports = router;
