var Sequelize = require("sequelize");
var sequelize = require("./database");

var ForumFicheiro = require("./ForumFicheiro");
var Utilizador = require("./Utilizador");

var DenunciaFicheiroForum = sequelize.define(
  "DENUNCIA_FORUM_FICHEIRO",
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
      onDelete: "CASCADE",
    },

    forumFicheiroId: {
      type: Sequelize.INTEGER,
      field: "ID_FORUM_FICHEIRO",
      allowNull: false,
      references: {
        model: "FORUM_FICHEIRO",
        key: "ID_FORUM_FICHEIRO",
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = DenunciaFicheiroForum;