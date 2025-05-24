var Sequelize = require("sequelize");
var sequelize = require("./database");
const bcrypt = require("bcrypt");


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
    passwordResetToken: {
      type: Sequelize.STRING,
      field: "PASSWORD_RESET_TOKEN",
      allowNull: true,
    },
    passwordResetTokenExpires: {
      type: Sequelize.DATE,
      field: "PASSWORD_RESET_TOKEN_EXPIRES",
      allowNull: true,
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

Utilizador.beforeCreate((utilizador, options) => {
  return bcrypt.hash(utilizador.password, 10).then((hash) => {
      utilizador.password = hash;
    })
    .catch((err) => {
      throw new Error('Erro ao fazer hash da palavra-passe antes de criar o utilizador.');
    });
});


module.exports = Utilizador;