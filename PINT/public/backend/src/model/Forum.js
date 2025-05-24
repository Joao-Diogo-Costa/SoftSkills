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

    conteudo: {
      type: Sequelize.STRING,
      field: "CONTEUDO",
      allowNull: false,
    },

    topicoId: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICOC",
      allowNull: false,
      references: {
        model: "TOPICOC",
        key: "ID_TOPICOC",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Forum;
