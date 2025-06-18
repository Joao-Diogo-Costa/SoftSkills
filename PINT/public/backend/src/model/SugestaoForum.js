var Sequelize = require("sequelize");
var sequelize = require("./database");

var Utilizador = require("./Utilizador");
var CategoriaC = require("./CategoriaC");
var AreaC = require("./AreaC");

var SugestaoForum = sequelize.define(
  "SUGESTAOFORUM",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_SUGESTAOFORUM",
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: Sequelize.STRING,
      field: "TITULO",
      allowNull: false,
    },
    dataSugestao: {
      type: Sequelize.DATE,
      field: "DATASUGESTAO",
      allowNull: false,
    },
    estado: {
      type: Sequelize.SMALLINT,
      field: "ESTADO",
      allowNull: true,
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

module.exports = SugestaoForum;
