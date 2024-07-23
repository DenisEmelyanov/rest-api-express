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
      type: ["number", "null"]
    },
    expiration: {
      type: ["string", "null"],
      //format: "date"
    },
    side: {
      type: ["string", "null"],
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
    assigned: {
      type: "boolean"
    }
  },
  required: ["ticker", "type", "premium", "openDate", "assigned"],
  additionalProperties: false,
};