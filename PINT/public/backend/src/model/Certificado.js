var Sequelize = require("sequelize");
var sequelize = require("./database");

var Formando = require("./Formando");

var Certificado = sequelize.define(
  "CERTIFICADO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_CERTIFICADO",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    dataCriacao: {
      type: Sequelize.DATE,
      field: "DATA_CRIAC",
      allowNull: false,
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);




module.exports = Certificado;