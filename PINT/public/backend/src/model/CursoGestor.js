var Sequelize = require("sequelize");
var sequelize = require("./database");

var Curso = require("./Curso");
var Gestor = require("./Gestor");

var CursoGestor = sequelize.define(
  "CURSO_GESTOR",
  {
    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      allowNull: false,
      primaryKey: true,
      references: {
        model: "CURSO",
        key: "ID_CURSO",
      },
    },
    gestorId: {
      type: Sequelize.INTEGER,
      field: "ID_GESTOR",
      allowNull: false,
      primaryKey: true,
      references: {
        model: "GESTOR",
        key: "ID_GESTOR",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);


module.exports = CursoGestor;