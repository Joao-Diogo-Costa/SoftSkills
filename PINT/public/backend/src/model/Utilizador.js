var Sequelize = require("sequelize");
var sequelize = require("./database");


var Utilizador = sequelize.define(
  "UTILIZADOR",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_UTILIZADOR",
      primaryKey: true,
      autoIncrement: true,
    },
    nomeUtilizador: {
      type: Sequelize.STRING,
      field: "NOME_UTILIZADOR",
      allowNull: false,
    },
    dataNasc: {
      type: Sequelize.DATE,
      field: "DATA_NASC",
      allowNull: false,
    },
    nTel: {
      type: Sequelize.STRING(9),
      field: "NTEL",
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      field: "EMAIL",
      allowNull: false,
      unique: true,
    },
    emailConfirmado: {
      type: Sequelize.BOOLEAN,
      field: "EMAIL_CONFIRMADO",
      allowNull: false,
      defaultValue: false,
    },
    tokenConfirmacaoEmail: {
      type: Sequelize.STRING,
      field: "TOKEN_CONFIRMACAO_EMAIL",
      allowNull: true,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      field: "PASSWORD",
      allowNull: false,
    },
    mustChangePassword: {
      type: Sequelize.BOOLEAN,
      default: true,
    },
    imagemPerfil: {
      type: Sequelize.STRING,
      field: "IMAGEM_PERFIL",
      allowNull: true,
    },
    pontos: {
      type: Sequelize.INTEGER,
      field: "PONTOS",
      allowNull: false,
      defaultValue: 0,
    },
    role: {
      type: Sequelize.ENUM("formador", "formando", "gestor"), 
      field: "ROLE",
      allowNull: false,
      defaultValue: "formando",
    },

    dataRegisto: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      field: "DATA_REGISTO",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Utilizador;