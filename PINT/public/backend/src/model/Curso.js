var Sequelize = require("sequelize");
var sequelize = require("./database");

var TopicoC = require("./TopicoC");

var Curso = sequelize.define(
  "CURSO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: Sequelize.STRING,
      field: "NOMECURSO",
      allowNull: false,
    },

    dataUpload: {
      type: Sequelize.DATE,
      field: "DATA_UPL",
      allowNull: false,
    },

    tipoCurso: {
      type: Sequelize.ENUM("Online", "Presencial"),
      field: "TIPOC",
      allowNull: false,
      defaultValue: "Online",
    },

    vaga: {
      type: Sequelize.INTEGER,
      field: "VAGA",
      allowNull: true,
    },

    dataLimiteInscricao: {
      type: Sequelize.DATE,
      field: "DATA_LIMITE_INSCRICAO",
      allowNull: true,
    },

    estado: {
      type: Sequelize.SMALLINT,
      field: "ESTADO",
      allowNull: false,
      defaultValue: 0,
    },

    descricaoCurso: {
      type: Sequelize.STRING,
      field: "DESCRICAOCURSO",
      allowNull: false,
    },

    duracao: {
      type: Sequelize.TIME,
      field: "DURACAO",
      allowNull: false,
    },

    nivel: {
      type: Sequelize.ENUM("Básico", "Intermediário", "Avançado"),
      field: "NIVEL",
      allowNull: false,
      defaultValue: "Básico",
    },

    pontuacao: {
      type: Sequelize.INTEGER,
      field: "PONTUACAO",
      allowNull: false,
      defaultValue: 100,
    },

    imagemBanner: {
      type: Sequelize.STRING,
      field: "IMAGEM_BANNER",
      allowNull: true,
    },

    topicoId: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICOC",
      allowNull: false,
      references: {
        model: "TOPICOC",
        key: "ID_TOPICOC",
      },
    },

    formadorId: {
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      allowNull: true, 
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

module.exports = Curso;
