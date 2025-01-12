const router = require("express").Router();

// Controller Imports
const QuoteController = require("./controllers/QuoteController");

// Middleware Imports
const isAuthenticatedMiddleware = require("./../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../common/middlewares/SchemaValidationMiddleware");
const CheckPermissionMiddleware = require("../common/middlewares/CheckPermissionMiddleware");

// JSON Schema Imports for payload verification
const createQuotePayload = require("./schemas/createQuotePayload");
const updateQuotePayload = require("./schemas/updateQuotePayload");
const { roles } = require("../config");

router.get(
   "/",
   //[isAuthenticatedMiddleware.check],
   QuoteController.getAllQuotes
 );

router.get(
   "/knn",
   //[isAuthenticatedMiddleware.check],
   QuoteController.getPredictedQuote
 );

// router.get(
//   "/groups",
//   //[isAuthenticatedMiddleware.check],
//   TransactionController.getAllGroups
// );

// router.get(
//   "/years",
//   //[isAuthenticatedMiddleware.check],
//   TransactionController.getAllYears
// );

router.get(
  "/latest",
  //[isAuthenticatedMiddleware.check],
  QuoteController.getLatestQuote
);

router.post(
  "/",
  [
    //isAuthenticatedMiddleware.check,
    //CheckPermissionMiddleware.has(roles.ADMIN),
    SchemaValidationMiddleware.verify(createQuotePayload),
  ],
  QuoteController.createQuote
);

router.patch(
  "/:ticker/:date",
  [
    //isAuthenticatedMiddleware.check,
    //CheckPermissionMiddleware.has(roles.ADMIN),
    SchemaValidationMiddleware.verify(updateQuotePayload),
  ],
  QuoteController.updateQuote
);

router.delete(
  "/:ticker/:date",
  //[isAuthenticatedMiddleware.check, CheckPermissionMiddleware.has(roles.ADMIN)],
  QuoteController.deleteQuote
);

module.exports = router;
