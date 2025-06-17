var Sequelize = require("sequelize");
var sequelize = require("./database");

var AreaC = require("./AreaC");

var TopicoC = sequelize.define(
  "TOPICOC",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICOC",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nomeTopico: {
      type: Sequelize.STRING,
      field: "NOMETOPICO",
      allowNull: false,
    },

    areaId: {
      type: Sequelize.INTEGER,
      field: "ID_AREAC",
      allowNull: false,
      references: {
        model: "AREAC",
        key: "ID_AREAC",
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports = TopicoC;
