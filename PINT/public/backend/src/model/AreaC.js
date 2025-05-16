var Sequelize = require("sequelize");
var sequelize = require("./database");

var CategoriaC = require("./CategoriaC");

var AreaC = sequelize.define(
  "AREAC",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "ID_AREAC",
    },

    nome: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "NOMEAREAC",
    },

    categoriaId: {
      type: Sequelize.INTEGER,
      field: "ID_CATEGORIAC",
      references: {
        model: "CATEGORIAC",
        key: "ID_CATEGORIAC",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AreaC;
