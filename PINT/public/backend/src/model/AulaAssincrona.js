var Sequelize = require("sequelize");
var sequelize = require("./database");

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

  cursoId: {
    type: Sequelize.INTEGER,
    field: "ID_CURSO",
    allowNull: false,
    references: {
      model: "CURSO",
      key: "ID_CURSO",
    },
  },
},
{
  freezeTableName: true,
  timestamps: false,
}
);

module.exports = AulaAssincrona;
