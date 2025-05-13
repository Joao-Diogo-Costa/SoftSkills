var Sequelize = require("sequelize");
var sequelize = require("./database");

var Gestor = require("./Gestor");

var Formador = sequelize.define(
  "FORMADOR",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_FORMADOR",
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: Sequelize.STRING,
      field: "NOMEF",
      allowNull: false,
    },
    dataNascimento: {
      type: Sequelize.DATE,
      field: "DATA_NASCF",
      allowNull: false,
    },
    telefone: {
      type: Sequelize.INTEGER,
      field: "NTELM",
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
  },
  {
    timestamps: false,
  }
);

Formador.belongsTo(Gestor, { foreignKey: "gestorId" });

module.exports = Formador;
