var Sequelize = require("sequelize");
var sequelize = require("./database");

var Curso = require("./Curso");
var Utilizador= require("./Utilizador");

var AvaliacaoCursoUtilizador = sequelize.define(
  "AVALIACAO_CURSO_UTILIZADOR",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AVALIACAO",
      primaryKey: true,
      autoIncrement: true,
    },

    nota: {
      // Avaliação geral do curso (escala de 1 a 5)
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
    },

    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      allowNull: false,
      references: {
        model: "CURSO",
        key: "ID_CURSO",
      },
      onDelete: "CASCADE",
    },
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AvaliacaoCursoUtilizador;
