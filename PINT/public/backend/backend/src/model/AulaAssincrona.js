var Sequelize = require("sequelize");
var sequelize = require("./database");

var Gestor = require("./Gestor");
var Curso = require("./Curso");

var AulaAssincrona = sequelize.define(
  "AULA_ASSINCRONA", 
  {
  id: {
    type: Sequelize.INTEGER,
    field: "ID_AULAASSINC",
    primaryKey: true,
    autoIncrement: true,
  },

  vaga: {
    type: Sequelize.INTEGER,
    field: "VAGA",
    allowNull: false,
  },

  descricaoAssincrona: {
    type: Sequelize.STRING,
    field: "DESCRICAOASSINCRONA",
    allowNull: false,
  },

  tituloAssincrona: {
    type: Sequelize.STRING,
    field: "TITULOASSINCRONA",
    allowNull: false,
  },

  dataLancAssincrona: {
    type: Sequelize.DATE,
    field: "DATA_LANCASSINCRO",
    allowNull: false,
  },

  gestorId: {
    type: Sequelize.INTEGER,
    field: "ID_GESTOR",
    allowNull: false,
    references: {
      model: Gestor,
      key: "ID_GESTOR",
    },
  },

  cursoId: {
    type: Sequelize.INTEGER,
    field: "ID_CURSO",
    allowNull: false,
    references: {
      model: Curso,
      key: "ID_CURSO",
    },
  },
},
{
  timestamps: false,
}
);

AulaAssincrona.belongsTo(Gestor, { foreignKey: "gestorId" });
AulaAssincrona.belongsTo(Curso, { foreignKey: "cursoId" });

module.exports = AulaAssincrona;
