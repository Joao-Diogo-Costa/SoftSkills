var Sequelize = require("sequelize");
var sequelize = require("./database");

const Gestor = require("./Gestor");
const Utilizador = require("./Utilizador");

var Formando = sequelize.define(
  "FORMANDO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_FORMANDO",
      primaryKey: true,
      autoIncrement: true,
    },
    outrasInf: {
      type: Sequelize.STRING,
      field: "OUTRASINF",
      allowNull: true,
    },
    pontos: {
      type: Sequelize.INTEGER,
      field: "PONTOS",
      allowNull: true,
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
      allowNull: false,
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


module.exports = Formando;
