var Sequelize = require("sequelize");
var sequelize = require("./database");

var Formador = require("./Formador");
var CategoriaC = require("./CategoriaC");
var AreaC = require("./AreaC");
var TopicoC = require("./TopicoC");

var Avaliacao = require("./Avaliacao");
var AvaliacaoCurso = require("./AvaliacaoCurso");

var Inscricao = require("./Inscricao");
var InscricaoCurso = require("./InscricaoCurso");

var CursoGestor = require("./CursoGestor");


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

    formadorId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMADOR",
      allowNull: false,
      references: {
        model: "FORMADOR",
        key: "ID_FORMADOR",
      },
    },

    categoriaId: {
      type: Sequelize.INTEGER,
      field: "ID_CATEGORIAC",
      references: {
        model: "CATEGORIAC",
        key: "ID_CATEGORIAC",
      },
    },

    areaId: {
      type: Sequelize.INTEGER,
      field: "ID_AREAC",
      references: {
        model: "AREAC",
        key: "ID_AREAC",
      },
    },

    topicoId: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICOC",
      references: {
        model: "TOPICOC",
        key: "ID_TOPICOC",
      },
    },
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports = Curso;
