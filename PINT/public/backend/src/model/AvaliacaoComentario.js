var Sequelize = require("sequelize");
var sequelize = require("./database");

var Comentario = require("./Comentario");
var Utilizador = require("./Utilizador");

var AvaliacaoComentario = sequelize.define(
  "AVALIACAO_COMENTARIO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_AVALIACAO",
      primaryKey: true,
      autoIncrement: true,
    },
    comentarioId: {
      type: Sequelize.INTEGER,
      field: "ID_COMENTARIO",
      allowNull: false,
      references: {
        model: "COMENTARIO",
        key: "ID_COMENTARIO",
      },
      onDelete: "CASCADE",
    },
    utilizadorId: {
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      allowNull: false,
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
      onDelete: "CASCADE",
    },
    dataLike: {
      type: Sequelize.DATE,
      field: "DATA_LIKE",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AvaliacaoComentario;