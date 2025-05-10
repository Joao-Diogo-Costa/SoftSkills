var Sequelize = require("sequelize");
var sequelize = require("./database");

var InscricaoCurso = sequelize.define(
  "INSCRICAO_CURSO",
  {
    inscricaoId: {
      type: Sequelize.INTEGER,
      field: "ID_INSCRICAO",
      primaryKey: true,
      allowNull: false,
    },
    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = InscricaoCurso;
