var Sequelize = require("sequelize");
var sequelize = require("./database");

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

    utilizadorId: {
      // Quem publicou o aviso
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      allowNull: false,
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
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

module.exports = Tarefa;
