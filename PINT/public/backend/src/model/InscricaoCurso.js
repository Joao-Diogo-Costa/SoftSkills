var Sequelize = require("sequelize");
var sequelize = require("./database");

const Curso = require("./Curso"); 

var InscricaoCurso = sequelize.define(
  "INSCRICAO_CURSO",
  {
    inscricaoId: {
      type: Sequelize.INTEGER,
      field: "ID_INSCRICAO",
      primaryKey: true,
      allowNull: false,
      references: {
        model: "INSCRICAO", 
        key: "ID_INSCRICAO",
      },
      onDelete: "CASCADE",
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
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = InscricaoCurso;
