const Sequelize = require("sequelize");
const sequelize = require("./database");

var Curso = require("./Curso");
var Utilizador= require("./Utilizador");

var AvisoCurso = sequelize.define(
  "AVISOCURSO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AVISOCURSO",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    descricao: {
      type: Sequelize.STRING,
      field: "DESCRICAO",
      allowNull: false,
    },

    titulo: {
      type: Sequelize.STRING,
      field: "TITULO",
      allowNull: false,
    },

    dataPublicacao: {
      type: Sequelize.DATE,
      field: "DATA_PUBLICACAO",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    utilizadorId: {
      // Quem publicou o aviso
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      allowNull: false,
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
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




module.exports = AvisoCurso;