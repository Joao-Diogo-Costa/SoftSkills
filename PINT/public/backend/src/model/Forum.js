var Sequelize = require("sequelize");
var sequelize = require("./database");

var Topico = require("./Topico");

var Forum = sequelize.define(
  "FORUM",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_FORUM",
      primaryKey: true,
      autoIncrement: true,
    },

    conteudo: {
      type: Sequelize.STRING,
      field: "CONTEUDO",
      allowNull: false,
    },

    topicoId: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICO",
      allowNull: false,
      references: {
        model: Topico,
        key: "ID_TOPICO",
      },
    },
  },
  {
    timestamps: false,
  }
);

Forum.belongsTo(Topico, { foreignKey: "topicoId" });

module.exports = Forum;
