var Sequelize = require("sequelize");
var sequelize = require("./database");

const Formador = require("./Formador");
const Formando = require("./Formando");
const Gestor = require("./Gestor");

var Utilizador = sequelize.define(
    "UTILIZADOR",
    {
    id: {
        type: Sequelize.INTEGER,
        field: 'ID_UTILIZADOR',
        primaryKey: true,
        autoIncrement: true
    },
    nomeUtilizador: {
        type: Sequelize.STRING,
        field: 'NOME_UTILIZADOR',
        allowNull: false,
    },
    dataNasc: {
        type: Sequelize.DATE,
        field: 'DATA_NASC',
        allowNull: false,
    },
    nTel: {
        type: Sequelize.STRING(9),
        field: 'NTEL',
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        field: 'EMAIL',
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        field: 'PASSWORD',
        allowNull: false
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
    timestamps: false
    }
);

module.exports = Utilizador;