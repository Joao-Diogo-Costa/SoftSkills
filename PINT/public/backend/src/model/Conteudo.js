var Sequelize = require("sequelize");
var sequelize = require("./database");

var Curso = require("./Curso");

var Conteudo = sequelize.define(
  "CONTEUDO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_CONTEUDO",
      primaryKey: true,
      autoIncrement: true,
    },

    titulo: {
      type: Sequelize.STRING,
      field: "TITULO",
      allowNull: true,
    },

    descricao: {
      type: Sequelize.STRING,
      field: "DESCRIPTION",
      allowNull: true,
    },

    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      allowNull: false,
      references: {
        model: "CURSO",
        key: "ID_CURSO",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Conteudo;
