var Sequelize = require("sequelize");
var sequelize = require("./database");

var Comentario = require("./Comentario");

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
