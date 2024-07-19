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
      type: "string",
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
    },
    closeDate: {
        type: "string"
    },
  },
  required: ["ticker", "type", "strike", "expiration", "side", "quantity", "premium", "openDate"],
  additionalProperties: false,
};