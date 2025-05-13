var Sequelize = require("sequelize");
var sequelize = require("./database");

const Gestor = require("./Gestor");

var Formando = sequelize.define(
  "FORMANDO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_FORMANDO",
      primaryKey: true,
      autoIncrement: true,
    },
    nomeFormando: {
      type: Sequelize.STRING,
      field: "NOMEFORMANDO",
      allowNull: false,
    },
    dataNasc: {
      type: Sequelize.DATE,
      field: "DATA_NASC",
      allowNull: true,
    },
    nTel: {
      type: Sequelize.STRING(9),
      field: "NTEL",
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      field: "EMAIL",
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      field: "PASSWORD",
      allowNull: false,
    },
    outrasInf: {
      type: Sequelize.STRING,
      field: "OUTRASINF",
      allowNull: true,
    },
    pontos: {
      type: Sequelize.INTEGER,
      field: "PONTOS",
      allowNull: true,
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

Formando.belongsTo(Gestor, { foreignKey: "gestorId" });

module.exports = Formando;
