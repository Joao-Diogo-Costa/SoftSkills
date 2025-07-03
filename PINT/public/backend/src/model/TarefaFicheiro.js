var Sequelize = require("sequelize");
var sequelize = require("./database");

var TarefaFicheiro = sequelize.define(
  "TAREFAFICHEIRO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_TAREFAFICHEIRO",
      primaryKey: true,
      autoIncrement: true,
    },
    nomeOriginal: {
      type: Sequelize.STRING,
      field: "NOME_ORIGINAL_FICHEIRO",
      allowNull: false,
    },

    url: {
      type: Sequelize.STRING,
      field: "URL_FICHEIRO",
      allowNull: false,
    },
    tipo: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "TIPO_FICHEIRO",
    },
    tarefaId: {
      type: Sequelize.INTEGER,
      field: "ID_TAREFA",
      allowNull: false,
      references: {
        model: "TAREFA",
        key: "ID_TAREFA",
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TarefaFicheiro;
