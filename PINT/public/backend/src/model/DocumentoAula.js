var Sequelize = require("sequelize");
var sequelize = require("./database");

var AulaAssincrona = require("./AulaAssincrona");

var DocumentoAula = sequelize.define(
  "DOCUMENTOAULA",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_DOCUMENTOSA",
      primaryKey: true,
      autoIncrement: true,
    },

    tipoDoc: {
      type: Sequelize.STRING,
      field: "TIPODOC",
      allowNull: false,
    },

    docA: {
      type: Sequelize.STRING,
      field: "DOCA",
      allowNull: false,
    },

    aulaAssincronaId: {
      type: Sequelize.INTEGER,
      field: "ID_AULAASSINC",
      allowNull: false,
      references: {
        model: "AULA_ASSINCRONA",
        key: "ID_AULAASSINC",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports = DocumentoAula;