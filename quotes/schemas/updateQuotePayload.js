//const { format } = require("morgan");

module.exports = {
  type: "object",
  properties: {
    ticker: {
      type: "string",
    },
    date: {
      type: ["string"],
      //format: "date"
    },
    open: {
      type: "number",
    },
    close: {
      type: "number",
    },
    high: {
      type: "number",
    },
    low: {
      type: "number",
    },
    volume: {
      type: "number"
    }
  },
  required: ["ticker", "date", "close"],
  additionalProperties: true,
};