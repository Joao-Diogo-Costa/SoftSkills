var Sequelize = require("sequelize");
var sequelize = require("./database");

var Utilizador = require("./Utilizador");
var Curso = require("./Curso");

var Inscricao = sequelize.define(
  "INSCRICAO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_INSCRICAO",
      primaryKey: true,
      autoIncrement: true,
    },

    dataInscricao: {
      type: Sequelize.DATE,
      field: "DATA_INSCRICAO",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    notaFinal: {
      type: Sequelize.DECIMAL(5, 2),
      field: "NOTA_FINAL",
      allowNull: true,
    },

    concluido: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: "CONCLUIDO",
    },

    dataConclusao: {
      type: Sequelize.DATE,
      field: "DATA_CONCLUSAO",
      allowNull: true,
    },

    certificadoGerado: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: "CERTIFICADO_GERADO",
    },

    utilizadorId: {
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      allowNull: false,
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
      onDelete: "CASCADE", // Se o utilizador for eliminado, as inscrições também
    },

    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      allowNull: false,
      references: {
        model: "CURSO",
        key: "ID_CURSO",
      },
      onDelete: "CASCADE", // Se o curso for eliminado, as inscrições também
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Inscricao;