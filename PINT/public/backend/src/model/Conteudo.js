var Sequelize = require("sequelize");
var sequelize = require("./database");

var Curso = require("./Curso");

var Conteudo = sequelize.define(
  "CONTEUDO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_CONTEUDO",
      primaryKey: true,
      autoIncrement: true,
    },

    tipo: {
      type: Sequelize.ENUM('link', 'ficheiro', 'video', 'texto'),
      field: "TIPO",
      allowNull: false,
    },
    titulo: {
      type: Sequelize.STRING,
      field: "TITULO",
      allowNull: true,
    },

    descricao: {
      type: Sequelize.STRING,
      field: "DESCRIPTION",
      allowNull: true,
    },
    ordem: { // Para controlar a ordem do conteúdo dentro da aula
      type: Sequelize.INTEGER,
      field: "ORDEM",
      allowNull: true,
    },

    // Campos específicos para cada tipo de conteúdo
    url_link: {
      type: Sequelize.STRING,
      field: "URL_LINK",
      allowNull: true,
    },
    nome_ficheiro: {
      type: Sequelize.STRING,
      field: "NOME_FICHEIRO",
      allowNull: true,
    },
    caminho_ficheiro: {
      type: Sequelize.STRING,
      field: "CAMINHO_FICHEIRO",
      allowNull: true,
    },
    url_video: {
      type: Sequelize.STRING,
      field: "URL_VIDEO",
      allowNull: true,
    },
    conteudo_texto: { // Para conteúdo de texto diretamente na BD
      type: Sequelize.TEXT('long'),
      field: "CONTEUDO_TEXTO",
      allowNull: true,
    },

    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      allowNull: false,
      references: {
        model: "CURSO",
        key: "ID_CURSO",
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Conteudo;
