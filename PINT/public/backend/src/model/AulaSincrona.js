var Sequelize = require("sequelize");
var sequelize = require("./database");

var Gestor = require("./Gestor");
var Curso = require("./Curso");

var AulaSincrona = sequelize.define(
  "AULA_SINCRONA",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AULASINC",
      primaryKey: true,
      autoIncrement: true,
    },

    tituloSincrona: {
      type: Sequelize.STRING,
      field: "TITULOSINCRONA",
      allowNull: false,
    },

    descricaoSincrona: {
      type: Sequelize.STRING,
      field: "DESCRICAOSINCRONA",
      allowNull: false,
    },

    dataLancSincrona: {
      type: Sequelize.DATE,
      field: "DATA_LANCSINCRO",
      allowNull: false,
    },
    
    vaga: {
      type: Sequelize.INTEGER,
      field: "VAGASINC",
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

    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      allowNull: false,
      references: {
        model: "CURSO",
        key: "ID_CURSO",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

AulaSincrona.belongsTo(Curso, { foreignKey: "cursoId" });
AulaSincrona.belongsTo(Gestor, { foreignKey: "gestorId" });

module.exports = AulaSincrona;
