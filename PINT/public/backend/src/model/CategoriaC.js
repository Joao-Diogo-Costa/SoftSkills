var Sequelize = require("sequelize");
var sequelize = require("./database");

var AreaC = require("./AreaC");

var CategoriaC = sequelize.define(
  "CATEGORIAC",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "ID_CATEGORIAC",
    },

    nome: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "NOMECATEG",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports = CategoriaC;
