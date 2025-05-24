const cron = require('node-cron');
const { Op } = require('sequelize');
const Curso = require('../model/Curso');

const atualizarEstadoDosCursos = async () => {
  const agora = new Date();

  // Atualizar cursos para Em curso (1)
  await Curso.update(
    { estado: 1 },
    {
      where: {
        estado: { [Op.ne]: 2 }, // não atualiza se já estiver como Terminado
        dataInicioPrevista: { [Op.lte]: agora },
        dataFimPrevista: { [Op.gt]: agora },
      },
    }
  );

  // Atualizar cursos para Terminado (2)
  await Curso.update(
    { estado: 2 },
    {
      where: {
        dataFimPrevista: { [Op.lte]: agora },
        estado: { [Op.ne]: 2 },
      },
    }
  );

  console.log(`[CRON] Estados dos cursos atualizados: ${new Date().toISOString()}`);
};

// Corre todos os dias à meia-noite
cron.schedule('0 0 * * *', () => {
  atualizarEstadoDosCursos();
});