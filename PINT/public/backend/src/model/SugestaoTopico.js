var Sequelize = require("sequelize");
var sequelize = require("./database");

var Formando = require("./Formando");

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
    categoria: {
      type: Sequelize.STRING,
      field: "CATEEGORIA",
      allowNull: false,
    },
    area: {
      type: Sequelize.STRING,
      field: "AREA",
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
        model: Formando,
        key: "ID_FORMANDO",
      },
    },
  },

  {
    timestamps: false,
  }
);

SugestaoTopico.belongsTo(Formando, { foreignKey: "formandoId" });

module.exports = SugestaoTopico;
