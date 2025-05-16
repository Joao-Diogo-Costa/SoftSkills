var Sequelize = require("sequelize");
var sequelize = require("./database");

var Avaliacao = require("./Avaliacao");
var Curso = require("./Curso");

var AvaliacaoCurso = sequelize.define(
  "AVALIACAO_CURSO",
  {
    avaliacaoId: {
      type: Sequelize.INTEGER,
      field: "ID_AVALIACAO",
      primaryKey: true,
      allowNull: false,
      references: {
        model: "AVALIACAO",
        key: "ID_AVALIACAO",
      },
    },
    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      primaryKey: true,
      allowNull: false,
      references: {
        model: "CURSO",
        key: "ID_CURSO",
      },
    },

    notaFinal: { 
      type: Sequelize.DECIMAL(4, 2),
      field: "NOTA_FINAL",
      allowNull: true,
      validate: {
        min: 0,
        max: 20,
      },
    },

  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);



module.exports = AvaliacaoCurso;
