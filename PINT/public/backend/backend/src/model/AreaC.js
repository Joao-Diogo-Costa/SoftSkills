var Sequelize = require("sequelize");
var sequelize = require("./database");

var CategoriaC = require("/CategoriaC");
var TopicoC = require("./TopicoC");

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
        model: CategoriaC,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

AreaC.belongsTo(CategoriaC, { foreignKey: "categoriaId" });
AreaC.hasMany(TopicoC, { foreignKey: "areaId" });

module.exports = AreaC;
