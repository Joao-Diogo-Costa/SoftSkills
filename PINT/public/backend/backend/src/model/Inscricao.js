var Sequelize = require("sequelize");
var sequelize = require("./database");

var Formando = require("./Formando");

var Curso = require("./Curso");
var InscricaoCurso = require("./InscricaoCurso");

var Inscricao = sequelize.define(
  "INSCRICAO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_INSCRICAO",
      primaryKey: true,
      autoIncrement: true,
    },

    dataInscricao: {
      type: Sequelize.DATE,
      field: "DATA_INSCRICAO",
      allowNull: false,
    },

    formandoId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMANDO",
      allowNull: false,
      references: {
        model: Formando,
        key: "ID_FORMANDO",
      },
    },
  },
  {
    timestamps: false,
  }
);

Inscricao.belongsTo(Formando, { foreignKey: "formandoId" });

Inscricao.belongsToMany(Curso, {
    through: InscricaoCurso,
    foreignKey: "inscricaoId",
    otherKey: "cursoId",
  });
  
module.exports = Inscricao;