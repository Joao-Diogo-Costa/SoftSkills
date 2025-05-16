var Sequelize = require("sequelize");
var sequelize = require("./database");
var Comentario = require("./Comentario"); 

var DocumentoForum = sequelize.define(
  "DOCUMENTOSFORUM", 
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_DOC",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    documento: {
      type: Sequelize.STRING(255),
      field: "DOCUMENTO",
      allowNull: true,
    },
    tipoDoc: {
      type: Sequelize.STRING(255),
      field: "TIPODOC",
      allowNull: true,
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

DocumentoForum.belongsTo(Comentario, { foreignKey: "comentarioId" });

module.exports = DocumentoForum;