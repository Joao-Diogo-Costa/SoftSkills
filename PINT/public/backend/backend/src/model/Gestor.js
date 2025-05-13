var Sequelize = require("sequelize");
var sequelize = require("./database");

var Gestor = sequelize.define(
  "GESTOR",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: "ID_GESTOR",
    },
    nome: {
      type: Sequelize.STRING,
      field: "NOMEG",
      allowNull: false,
    },
    dataNascimento: {
      type: Sequelize.DATEONLY,
      field: "DATA_NASCG",
      allowNull: false,
    },
    telefone: {
      type: Sequelize.INTEGER,
      field: "NTELG",
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Gestor.belongsToMany(Curso, {
  through: CursoGestor,
  foreignKey: "gestorId",
  otherKey: "cursoId",
});

module.exports = Gestor;
