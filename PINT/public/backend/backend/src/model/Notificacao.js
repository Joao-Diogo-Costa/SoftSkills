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
        model: Gestor,
        key: "ID_GESTOR",
      },
    },

    formadorId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMADOR",
      allowNull: true,
      references: {
        model: Formador,
        key: "ID_FORMADOR",
      },
    },

    formandoId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMANDO",
      allowNull: true,
      references: {
        model: Formando,
        key: "ID_FORMANDO",
      },
    },
  },
  {
    timestamps: false,
  }
);

Notificacao.belongsTo(Gestor, { foreignKey: "gestorId" });
Notificacao.belongsTo(Formador, { foreignKey: "formadorId" });
Notificacao.belongsTo(Formando, { foreignKey: "formandoId" });

module.exports = Notificacao;