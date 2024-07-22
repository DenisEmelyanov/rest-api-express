const { format } = require("morgan");

module.exports = {
  type: "object",
  properties: {
    ticker: {
      type: "string",
    },
    type: {
      type: "string",
      enum: ["call", "put", "stock", "interest", "dividend"]
    },
    strike: {
      type: "number",
    },
    expiration: {
      type: "string",
      //format: "date"
    },
    side: {
      type: "string",
    },
    quantity: {
      type: "number",
    },
    premium: {
      type: "number",
    },
    openDate: {
      type: "string",
      //format: "date"
    },
    closeDate: {
      type: ["string", "null"],
      //format: "date"
    },
  },
  required: ["ticker", "type", "premium", "openDate"],
  additionalProperties: false,
};