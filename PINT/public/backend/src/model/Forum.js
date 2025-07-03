var Sequelize = require("sequelize");
var sequelize = require("./database");

var TopicoC = require("./TopicoC");

var Forum = sequelize.define(
  "FORUM",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_FORUM",
      primaryKey: true,
      autoIncrement: true,
    },

    nome: {
      type: Sequelize.STRING,
      field: "NOME_FORUM",
      allowNull: false,
    },

    descricao: {
      type: Sequelize.STRING,
      field: "DESCRICAO_FORUM",
      allowNull: true,
    },

    imagemForum: {
      type: Sequelize.STRING,
      field: "IMAGEM_FORUM",
      allowNull: true,
    },

    topicoId: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICOC",
      allowNull: false,
      references: {
        model: "TOPICOC",
        key: "ID_TOPICOC",
      },
      onDelete: "CASCADE",
    },

  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Forum;
