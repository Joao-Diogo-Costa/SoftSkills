var Sequelize = require("sequelize");
var sequelize = require("./database");

var Gestor = require("./Gestor");
var Formador = require("./Formador");
var Formando = require("./Formando");

var Notificacao = sequelize.define(
  "NOTIFICACAO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_NOTIFICACAO",
      primaryKey: true,
      autoIncrement: true,
    },

    mensagem: {
      type: Sequelize.STRING,
      field: "MENSAGEM",
      allowNull: false,
    },

    dataEnvio: {
      type: Sequelize.DATE,
      field: "DATA_ENVIO",
      allowNull: false,
    },

    gestorId: {
      type: Sequelize.INTEGER,
      field: "ID_GESTOR",
      allowNull: true,
      references: {
        model: "GESTOR",
        key: "ID_GESTOR",
      },
    },

    formadorId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMADOR",
      allowNull: true,
      references: {
        model: "FORMADOR",
        key: "ID_FORMADOR",
      },
    },

    formandoId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMANDO",
      allowNull: true,
      references: {
        model: "FORMANDO",
        key: "ID_FORMANDO",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports = Notificacao;