const { format } = require("morgan");

module.exports = {
  type: "object",
  properties: {
    ticker: {
      type: "string",
    },
    portfolio: {
      type: "string",
    },
    group: {
      type: ["string", "null"],
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
    openSide: {
      type: ["string", "null"]
    },
    closeSide: {
      type: ["string", "null"]
    },
    quantity: {
      type: "number",
    },
    premium: {
      type: "number",
    },
    openAmount: {
      type: ["number", "null"],
    },
    closeAmount: {
      type: ["number", "null"],
    },
    openDate: {
      type: "string",
      //format: "date"
    },
    closeDate: {
      type: ["string", "null"],
      //format: "date"
    },
    year: {
      type: "number",
    },
    assigned: {
      type: "boolean"
    }
  },
  required: ["portfolio", "ticker", "type", "premium", "openDate", "year", "assigned"],
  additionalProperties: true,
};