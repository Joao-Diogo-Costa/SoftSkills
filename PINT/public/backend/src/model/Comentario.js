var Sequelize = require("sequelize");
var sequelize = require("./database");

var Forum = require("./Forum");
var Utilizador= require("./Utilizador");

var Comentario = sequelize.define(
  "COMENTARIO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_COMENTARIO",
      primaryKey: true,
      autoIncrement: true,
    },

    texto: {
      type: Sequelize.STRING,
      field: "TEXTO",
      allowNull: false,
    },

    ficheiroNome: {
      type: Sequelize.STRING,
      field: "FICHEIRO__NOME",
      allowNull: true, 
    },

    ficheiroCaminho: {
      type: Sequelize.STRING,
      field: "FICHEIRO_CAMINHO",
      allowNull: true, 
    },

    dataComentario: {
      type: Sequelize.DATE,
      field: "DATA_COME",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    forumId: {
      type: Sequelize.INTEGER,
      field: "ID_FORUM",
      allowNull: false,
      references: {
        model: "FORUM",
        key: "ID_FORUM",
      },
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);



module.exports = Comentario;