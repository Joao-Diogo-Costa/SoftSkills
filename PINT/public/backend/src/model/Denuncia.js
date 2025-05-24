var Sequelize = require("sequelize");
var sequelize = require("./database");

var Comentario = require("./Comentario");
var Utilizador = require("./Utilizador");

var Denuncia = sequelize.define(
  "DENUNCIA",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_DENUNCIA",
      primaryKey: true,
      autoIncrement: true,
    },

    descricao: {
      type: Sequelize.STRING,
      field: "DESCRICAO",
      allowNull: false,
    },

    dataDenuncia: {
      type: Sequelize.DATE,
      field: "DATA_DENUNCIA",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    utilizadorId: {
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      allowNull: false,
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
    },

    comentarioId: {
      type: Sequelize.INTEGER,
      field: "ID_COMENTARIO",
      allowNull: false,
      references: {
        model: "COMENTARIO",
        key: "ID_COMENTARIO",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports = Denuncia;
