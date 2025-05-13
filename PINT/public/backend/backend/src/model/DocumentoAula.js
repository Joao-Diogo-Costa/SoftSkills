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
        model: AulaAssincrona,
        key: "ID_AULAASSINC",
      },
    },
  },
  {
    timestamps: false,
  }
);

DocumentoAula.belongsTo(AulaAssincrona, { foreignKey: "aulaAssincronaId" });

module.exports = DocumentoAula;