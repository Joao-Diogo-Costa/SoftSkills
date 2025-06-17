var Sequelize = require("sequelize");
var sequelize = require("./database");


var Curso = require("./Curso");

var AulaSincrona = sequelize.define(
  "AULA_SINCRONA",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AULASINC",
      primaryKey: true,
      autoIncrement: true,
    },

    tituloSincrona: {
      type: Sequelize.STRING,
      field: "TITULOSINCRONA",
      allowNull: false,
    },

    descricaoSincrona: {
      type: Sequelize.STRING,
      field: "DESCRICAOSINCRONA",
      allowNull: false,
    },

    dataLancSincrona: {
      type: Sequelize.DATE,
      field: "DATA_LANCSINCRO",
      allowNull: false,
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

module.exports = AulaSincrona;
