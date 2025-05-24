var Sequelize = require("sequelize");
var sequelize = require("./database");

var Utilizador = require("./Utilizador");
var Curso = require("./Curso");

var Notificacao = sequelize.define(
  "NOTIFICACAO",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_NOTIFICACAO",
      primaryKey: true,
      autoIncrement: true,
    },

    mensagem: {
      type: Sequelize.STRING,
      field: "MENSAGEM",
      allowNull: false,
    },
    tipo: {
      type: Sequelize.ENUM(
        'alteracao_curso',
        'nova_aula',
        'alteracao_data',
        'novo_material',
        'aviso_geral',
        'confirmacao_inscricao',
        'avaliacao_disponivel',
        'trabalho_submetido',
      ),
      allowNull: false,
      field: "TIPO"
    },

    dataEnvio: {
      type: Sequelize.DATE,
      field: "DATA_ENVIO",
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    lida: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "LIDA"
    },

    utilizadorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "ID_UTILIZADOR",
      references: {
        model: "UTILIZADOR",
        key: "ID_UTILIZADOR",
      },
    },

    cursoId: {
      type: Sequelize.INTEGER,
      field: "ID_CURSO",
      allowNull: true,
      references: {
        model: "CURSO",
        key: "ID_CURSO",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);


module.exports = Notificacao;