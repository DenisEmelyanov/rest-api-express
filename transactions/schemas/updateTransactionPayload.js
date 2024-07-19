module.exports = {
  type: "object",
  properties: {
    ticker: {
      type: "string",
    },
    type: {
      type: "string",
    },
    strike: {
      type: "number",
    },
    expiration: {
      type: "date",
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
      type: "date",
    },
    closeDate: {
      type: "date",
    },
  },
  additionalProperties: false,
};