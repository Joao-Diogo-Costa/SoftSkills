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
        model: "FORMADOR",
        key: "ID_FORMADOR",
      },
    },

    formandoId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMANDO",
      allowNull: false,
      references: {
        model: "FORMANDO",
        key: "ID_FORMANDO",
      },
    },
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Avaliacao;
