var Sequelize = require("sequelize");
var sequelize = require("./database");

var Gestor = require("./Gestor");

var Topico = sequelize.define(
  "TOPICOS",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICO",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    categoria: {
      type: Sequelize.STRING,
      field: "CATEGORIAT",
      allowNull: false,
    },

    nome: {
      type: Sequelize.STRING,
      field: "NOMET",
      allowNull: false,
    },

    criador: {
      type: Sequelize.STRING,
      field: "CRIADORT",
      allowNull: false,
    },

    dataCriacao: {
      type: Sequelize.DATE,
      field: "DATA_CRIA",
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
  },
  {
    timestamps: false,
  }
);


Topico.belongsTo(Gestor, { foreignKey: "gestorId" });

module.exports = Topico;