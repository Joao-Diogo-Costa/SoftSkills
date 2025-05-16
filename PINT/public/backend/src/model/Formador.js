var Sequelize = require("sequelize");
var sequelize = require("./database");

var Gestor = require("./Gestor");
const Utilizador = require("./Utilizador");

var Formador = sequelize.define(
  "FORMADOR",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_FORMADOR",
      primaryKey: true,
      autoIncrement: true,
    },
    utilizadorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "ID_UTILIZADOR",
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
      unique: true, 
    },

    gestorId: {
      type: Sequelize.INTEGER,
      field: "ID_GESTOR",
      allowNull: true,
      references: {
        model: "GESTOR",
        key: "ID_GESTOR",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Formador;
