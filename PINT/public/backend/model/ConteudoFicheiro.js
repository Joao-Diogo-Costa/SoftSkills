var Sequelize = require("sequelize");
var sequelize = require("./database");

var Conteudo = require("./Conteudo");

var ConteudoFicheiro = sequelize.define(
  "CONTEUDO_FICHEIRO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_CONTEUDO_FICHEIRO",
      autoIncrement: true,
      primaryKey: true,
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

    conteudoId: {
      type: Sequelize.INTEGER,
      field: "ID_CONTEUDO",
      allowNull: false,
      references: {
        model: "CONTEUDO",
        key: "ID_CONTEUDO",
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ConteudoFicheiro;
