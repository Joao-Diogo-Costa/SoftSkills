var Sequelize = require("sequelize");
var sequelize = require("./database"); 

const Utilizador = require("./Utilizador");
const AulaAssincrona = require("./AulaAssincrona");
const Curso = require("./Curso");

var ProgressoAulaAssincrona = sequelize.define(
    "PROGRESSO_AULA_ASSINCRONA",
    {
        id: {
            type: Sequelize.INTEGER,
            field: "ID_PROGESSO_AULA",
            autoIncrement: true,
            primaryKey: true,
        },
        dataConclusao: {
            type: Sequelize.DATE,
            field: "DATA_CONCLUSAO",
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        utilizadorId: {
            type: Sequelize.INTEGER,
            field: "ID_UTILIZADOR",
            allowNull: false,
            references: {
                model: "UTILIZADOR", 
                key: "ID_UTILIZADOR", 
            },
            onDelete: "CASCADE", 
        },
        aulaAssincronaId: {
            type: Sequelize.INTEGER,
            field: "ID_AULAASSINC",
            allowNull: false,
            references: {
                model: "AULA_ASSINCRONA", 
                key: "ID_AULAASSINC", 
            },
            onDelete: "CASCADE", 
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
        tableName: "PROGRESSO_AULA_ASSINCRONA",
        timestamps: false,
        uniqueKeys: {
            unique_utilizador_aula: {
                fields: ['ID_UTILIZADOR', 'ID_AULAASSINC']
            }
        }
    }
);

module.exports = ProgressoAulaAssincrona;