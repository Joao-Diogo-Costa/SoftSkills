var Sequelize = require("sequelize");
const sequelize = new Sequelize("PINT", "postgres", "111", {
  host: "localhost",
  port: "5432",
  dialect: "postgres",
  logging: console.log,
});
module.exports = sequelize;
