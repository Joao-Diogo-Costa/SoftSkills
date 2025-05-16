var Sequelize = require("sequelize");
var sequelize = require("./database");

var Formando = require("./Formando");
var CategoriaC = require("./CategoriaC");
var AreaC = require("./AreaC");

var SugestaoTopico = sequelize.define(
  "SUGESTAOTOPICO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_SUGESTAOTOPIC",
      primaryKey: true,
      autoIncrement: true,
    },

    titulo: {
      type: Sequelize.STRING,
      field: "TITULO",
      allowNull: false,
    },
    dataSugestao: {
      type: Sequelize.DATE,
      field: "DATASUGESTAO",
      allowNull: false,
    },
    estado: {
      type: Sequelize.SMALLINT,
      field: "ESTADO",
      allowNull: true,
    },

    formandoId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMANDO",
      allowNull: false,
      references: {
        model: "FORMANDO",
        key: "ID_FORMANDO",
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
    
    areaId: {
      type: Sequelize.INTEGER,
      field: "ID_AREAC",
      allowNull: false,
      references: {
        model: "AREAC",
        key: "ID_AREAC",
      },
    },
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = SugestaoTopico;
