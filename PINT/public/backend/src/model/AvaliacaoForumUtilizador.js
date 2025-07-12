var Sequelize = require("sequelize");
var sequelize = require("./database");

var Forum = require("./Forum");
var Utilizador = require("./Utilizador");

var AvaliacaoForumUtilizador = sequelize.define(
  "AVALIACAO_FORUM_UTILIZADOR",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AVALIACAO",
      primaryKey: true,
      autoIncrement: true,
    },

    nota: {
      // Avaliação geral do fórum (escala de 1 a 5)
      type: Sequelize.INTEGER,
      field: "NOTA",
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    dataAvaliacao: {
      type: Sequelize.DATE,
      field: "DATA_AVALIACAO",
      allowNull: false,
      defaultValue: Sequelize.NOW,
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

    forumId: {
      type: Sequelize.INTEGER,
      field: "ID_FORUM",
      allowNull: false,
      references: {
        model: "FORUM",
        key: "ID_FORUM",
      },
      onDelete: "CASCADE",
    },
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AvaliacaoForumUtilizador;