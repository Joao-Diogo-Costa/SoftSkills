var Sequelize = require("sequelize");
var sequelize = require("./database");

var ForumFicheiro = require("./ForumFicheiro");
var Utilizador = require("./Utilizador");

var AvaliacaoForumFicheiro = sequelize.define(
  "AVALIACAO_FORUM_FICHEIRO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AVALIACAO",
      primaryKey: true,
      autoIncrement: true,
    },
    nota: {
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
    forumFicheiroId: {
      type: Sequelize.INTEGER,
      field: "ID_FORUM_FICHEIRO",
      allowNull: false,
      references: {
        model: "FORUM_FICHEIRO",
        key: "ID_FORUM_FICHEIRO",
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AvaliacaoForumFicheiro;