const Sequelize = require("sequelize");
const sequelize = require("./database");
const Utilizador = require("./Utilizador");

const Gestor = sequelize.define(
  "GESTOR",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: "ID_GESTOR",
      autoIncrement: true,
    },
    utilizadorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      field: "ID_UTILIZADOR",
      references: {
        model: "UTILIZADOR", 
        key: "ID_UTILIZADOR", 
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    tableName: "GESTOR",
    timestamps: false,
  }
);

module.exports = Gestor;