const userResolver = require("./user");
const eventResolver = require("./event");
const bookingResolver = require("./booking");

const rootResolver = { ...userResolver, ...eventResolver, ...bookingResolver };
module.exports = rootResolver;
