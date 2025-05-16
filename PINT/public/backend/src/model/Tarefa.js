var Sequelize = require("sequelize");
var sequelize = require("./database");

var SubmissaoTarefa = require("./SubmissaoTarefa");
var AulaSincrona = require("./AulaSincrona");

var Tarefa = sequelize.define(
  "TAREFA",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_TAREFA",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    titulo: {
      type: Sequelize.STRING,
      field: "TITULO",
      allowNull: false,
    },
    descricao: {
      type: Sequelize.STRING,
      field: "DESCRICAO",
      allowNull: false,
    },
    dataLimite: {
      type: Sequelize.DATE,
      field: "DATALIMITE",
      allowNull: false,
    },
    
    ficheiroEnunciado: {
      type: Sequelize.STRING,
      field: "FICHENUNCIADO",
      allowNull: true,
    },

    idAulaSinc: {
      type: Sequelize.INTEGER,
      field: "ID_AULASINC",
      allowNull: true,
      references: {
        model: "AULA_SINCRONA",
        key: "ID_AULASINC",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Tarefa;
