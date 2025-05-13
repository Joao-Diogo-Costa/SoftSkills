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
        model: Curso,
        key: "ID_CURSO",
      },
    },
    gestorId: {
      type: Sequelize.INTEGER,
      field: "ID_GESTOR",
      allowNull: false,
      primaryKey: true,
      references: {
        model: Gestor,
        key: "ID_GESTOR",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);


CursoGestor.belongsTo(Curso, { foreignKey: "cursoId" });
CursoGestor.belongsTo(Gestor, { foreignKey: "gestorId" });

module.exports = CursoGestor;