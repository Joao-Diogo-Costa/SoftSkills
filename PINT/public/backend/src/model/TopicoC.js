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
        model: AreaC,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

// Relacionamento: Um Topicoc pertence a uma AreaC
TopicoC.belongsTo(AreaC, { foreignKey: "areaId" });

module.exports = TopicoC;
