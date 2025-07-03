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
    type: Sequelize.TEXT,
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

  videoLink: {
    type: Sequelize.STRING,
    allowNull: true, 
    field: "VIDEO_LINK",
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

module.exports = AulaAssincrona;
