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

    nomeOriginal: {
        type: Sequelize.STRING,
        field: "NOME_ORIGINAL_FICHEIRO",
        allowNull: false,
    },

    url: {
        type: Sequelize.STRING,
        field: "URL_FICHEIRO",
        allowNull: false,
    },
    tipo: { 
        type: Sequelize.STRING,
        allowNull: true, 
        field: "TIPO_FICHEIRO",
    },

    utilizadorId: {
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      allowNull: false,
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
      onDelete: "CASCADE",
    },

    aulaAssincronaId: {
      type: Sequelize.INTEGER,
      field: "ID_AULAASSINC",
      allowNull: false,
      references: {
        model: "AULA_ASSINCRONA",
        key: "ID_AULAASSINC",
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports = DocumentoAula;