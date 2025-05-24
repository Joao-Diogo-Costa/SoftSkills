require("dotenv").config();
var Sequelize = require("sequelize");
// LOCAL
// const sequelize = new Sequelize("PINT", "postgres", "111", {
//   host: "localhost",
//   port: "5432",
//   dialect: "postgres",
//   logging: console.log,
// });

// Render
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, 
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // necessário para Render
    },
  },
});

module.exports = sequelize;


