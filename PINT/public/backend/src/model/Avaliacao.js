var Sequelize = require("sequelize");
var sequelize = require("./database");

var Formador = require("./Formador");
var Formando = require("./Formando");

var Curso = require("./Curso");
var AvaliacaoCurso = require("./AvaliacaoCurso");

var Avaliacao = sequelize.define(
  "AVALIACAO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AVALIACAO",
      primaryKey: true,
      autoIncrement: true,
    },

    nota: {
      type: Sequelize.DECIMAL(4, 2),
      field: "NOTA",
      allowNull: true,
      validate: {
        min: 0,
        max: 20,
      },
    },

    dataLimite: {
      type: Sequelize.DATE,
      field: "DATALIMITE",
      allowNull: false,
    },

    dataAvaliacao: {
      type: Sequelize.DATE,
      field: "DATA_AVAL",
      allowNull: true,
    },

    formadorId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMADOR",
      allowNull: false,
      references: {
        model: Formador,
        key: "ID_FORMADOR",
      },
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

Avaliacao.belongsTo(Formador, { foreignKey: "formadorId" });
Avaliacao.belongsTo(Formando, { foreignKey: "formandoId" });

Avaliacao.belongsToMany(Curso, {
  through: AvaliacaoCurso,
  foreignKey: "avaliacaoId",
  otherKey: "cursoId",
});

module.exports = Avaliacao;
