var Sequelize = require("sequelize");
var sequelize = require("./database");

var SubmissaoTarefa = sequelize.define(
  "SUBMISSAOTAREFA",
  {
    id: {
      type: Sequelize.INTEGER,
      field: "ID_SUB",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fichEntrega: {
      type: Sequelize.STRING,
      field: "FICHENTREGA",
      allowNull: true, 
    },
    dataEntrega: {
      type: Sequelize.DATE,
      field: "DATAENTREGA",
      allowNull: true, 
    },
    nota: {
      type: Sequelize.FLOAT,
      field: "NOTA",
      allowNull: true,
      validate: {
        min: 0,
        max: 20,
      }, 
    },
  },
  {
    timestamps: false,
  }
);

SubmissaoTarefa.belongsTo(Tarefa, { foreignKey: "idTarefa" });

module.exports = SubmissaoTarefa;
