var Sequelize = require("sequelize");
var sequelize = require("./database");

var Tarefa = require("./Tarefa");
var Utilizador = require("./Utilizador");


var SubmissaoTarefa = sequelize.define(
  "SUBMISSAOTAREFA",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_SUB",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    nota: {
      type: Sequelize.FLOAT,
      field: "NOTA",
      allowNull: true,
      validate: {
        min: 0,
        max: 20,
      },
    },

    utilizadorId: {
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      allowNull: false,
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
      onDelete: "CASCADE",
    },

    idTarefa: {
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


module.exports = SubmissaoTarefa;
