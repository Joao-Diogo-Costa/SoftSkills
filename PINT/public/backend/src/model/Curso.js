var Sequelize = require("sequelize");
var sequelize = require("./database");

var TopicoC = require("./TopicoC");
const { fields } = require("../config/multerConfig");


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

    capacidadeMaxima: {
      type: Sequelize.INTEGER,
      field: "CAPACIDADE_MAXIMA",
      allowNull: true,
    },

    estado: {
      type: Sequelize.SMALLINT,
      field: "ESTADO",
      allowNull: false,
      defaultValue: 0,
    },

    visibilidadeStatus: {
      type: Sequelize.ENUM('visivel', 'oculto', 'arquivado'),
      field: "VISIBILIDADE_STATUS",
      allowNull: false,
      defaultValue: 'visivel',
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

    numParticipante:
    {
      type: Sequelize.INTEGER,
      field: "NUM_PARTICIPANTE",
      allowNull: false,
      defaultValue: 0,
    },

    dataUpload: {
      type: Sequelize.DATE,
      field: "DATA_UPL",
      allowNull: false,
    },

    dataInicio: {
      type: Sequelize.DATE,
      field: "DATA_INICIO",
      allowNull: false,
    },

    dataFim: {
      type: Sequelize.DATE,
      field: "DATA_FIM",
      allowNull: false,
    },

    dataLimiteInscricao: {
      type: Sequelize.DATE,
      field: "DATA_LIMITE_INSCRICAO",
      allowNull: true,
    },  

    imagemBanner: {
      type: Sequelize.STRING,
      field: "IMAGEM_BANNER",
      allowNull: true,
    },

    previousCursoId: {
      type: Sequelize.INTEGER,
      field: "PREVIOUS_COURSE_ID",
      allowNull: true,
      references: {
        model: "CURSO", 
        key: "ID_CURSO",
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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

Curso.beforeCreate((curso) => {
  if (curso.dataInicio) {
    curso.dataLimiteInscricao = new Date(curso.dataInicio.getTime() - 3 * 24 * 60 * 60 * 1000);
  }
});

Curso.beforeUpdate((curso) => {
  if (curso.dataInicio) {
    curso.dataLimiteInscricao = new Date(curso.dataInicio.getTime() - 3 * 24 * 60 * 60 * 1000);
  }
});

module.exports = Curso;
