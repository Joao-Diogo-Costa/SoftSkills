var Sequelize = require("sequelize");
var sequelize = require("./database");

const Forum = require("./Forum");

var ForumFicheiro = sequelize.define(
    "FORUM_FICHEIRO", 
  {
    id: {
        type: Sequelize.INTEGER,
        field: "ID_FORUM_FICHEIRO", 
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

module.exports = ForumFicheiro;
