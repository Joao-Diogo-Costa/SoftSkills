var Sequelize = require("sequelize");
var sequelize = require("./database");

var Inscricao = require("./Inscricao");

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
      field: "DATA_CRIACAO",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    inscricaoId: {
      type: Sequelize.INTEGER,
      field: "ID_INSCRICAO",
      allowNull: false,
      references: {
        model: "INSCRICAO",
        key: "ID_INSCRICAO",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);




module.exports = Certificado;