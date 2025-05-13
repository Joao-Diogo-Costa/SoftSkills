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
      type: Sequelize.STRING,
      field: "TIPOC",
      allowNull: false,
    },

    estado: {
      type: Sequelize.SMALLINT,
      field: "ESTADO",
      allowNull: false,
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

    pontuacao: {
      type: Sequelize.INTEGER,
      field: "PONTUACAO",
      allowNull: false,
      defaultValue: 0,
    },

    formadorId: {
      type: Sequelize.INTEGER,
      field: "ID_FORMADOR",
      allowNull: false,
      references: {
        model: Formador,
        key: "ID_FORMADOR",
      },
    },

    categoriaId: {
      type: Sequelize.INTEGER,
      field: "ID_CATEGORIAC",
      references: {
        model: CategoriaC,
        key: "id",
      },
    },

    areaId: {
      type: Sequelize.INTEGER,
      field: "ID_AREAC",
      references: {
        model: AreaC,
        key: "id",
      },


    },

    topicoId: {
      type: Sequelize.INTEGER,
      field: "ID_TOPICOC",
      references: {
        model: TopicoC,
        key: "id",
      },
    },
  },

  {
    timestamps: false,
  }
);

Curso.belongsTo(Formador, { foreignKey: "formadorId" });
Curso.belongsTo(CategoriaC, { foreignKey: "categoriaId" });
Curso.belongsTo(AreaC, { foreignKey: "areaId" }); 
Curso.belongsTo(TopicoC, { foreignKey: "topicoId" }); 

Curso.belongsToMany(Gestor, {
  through: CursoGestor,
  foreignKey: "cursoId",
  otherKey: "gestorId",
});

Curso.belongsToMany(Avaliacao, {
  through: AvaliacaoCurso,
  foreignKey: "cursoId",
  otherKey: "avaliacaoId",
});

Curso.belongsToMany(Inscricao, {
  through: InscricaoCurso,
  foreignKey: "cursoId",
  otherKey: "inscricaoId",
});

module.exports = Curso;
