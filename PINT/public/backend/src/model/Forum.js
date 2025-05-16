var Sequelize = require("sequelize");
var sequelize = require("./database");

var Topico = require("./Topico");

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
      field: "ID_TOPICO",
      allowNull: false,
      references: {
        model: "TOPICO",
        key: "ID_TOPICO",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Forum;
