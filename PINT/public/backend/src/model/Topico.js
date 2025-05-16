var Sequelize = require("sequelize");
var sequelize = require("./database");

var Gestor = require("./Gestor");
var CategoriaC = require("./CategoriaC");

var Topico = sequelize.define(
  "TOPICO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICO",
      primaryKey: true,
      autoIncrement: true,
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
        model: "GESTOR",
        key: "ID_GESTOR",
      },
    },

    categoriaId: {
      type: Sequelize.INTEGER,
      field: "ID_CATEGORIAC",
      allowNull: false,
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


module.exports = Topico;