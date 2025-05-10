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
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

Avaliacao.belongsToMany(Curso, {
  through: AvaliacaoCurso,
  foreignKey: "avaliacaoId",
  otherKey: "cursoId",
});

Curso.belongsToMany(Avaliacao, {
  through: AvaliacaoCurso,
  foreignKey: "cursoId",
  otherKey: "avaliacaoId",
});

module.exports = AvaliacaoCurso;
