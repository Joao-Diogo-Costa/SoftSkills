const Sequelize = require("sequelize");
const sequelize = require("./database");

var AulaAssincrona = require("./AulaAssincrona");
var AulaSincrona = require("./AulaSincrona");
var Formador = require("./Formador");

var Aviso = sequelize.define(
  "AVISO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AVISO",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    descricao: {
      type: Sequelize.STRING,
      field: "DESCRICAO",
      allowNull: false,
    },

    aulaAssincronaId: {
      type: Sequelize.INTEGER,
      field: "ID_AULAASSINC",
      allowNull: true,
      references: {
        model: "AULA_ASSINCRONA",
        key: "ID_AULAASSINC",
      },
    },

    aulaSincronaId: {
      type: Sequelize.INTEGER,
      field: "ID_AULASINC",
      allowNull: true,
      references: {
        model: "AULA_SINCRONA",
        key: "ID_AULASINC",
      },
    },

    formadorId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMADOR",
      allowNull: true,
      references: {
        model: "FORMADOR",
        key: "ID_FORMADOR",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);




module.exports = Aviso;