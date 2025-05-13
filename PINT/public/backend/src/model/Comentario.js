var Sequelize = require("sequelize");
var sequelize = require("./database");

var Forum = require("./Forum");
var Formando = require("./Formando");

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
        model: Forum,
        key: "ID_FORUM",
      },
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

Comentario.belongsTo(Forum, { foreignKey: "forumId" });
Comentario.belongsTo(Formando, { foreignKey: "formandoId" });

module.exports = Comentario;