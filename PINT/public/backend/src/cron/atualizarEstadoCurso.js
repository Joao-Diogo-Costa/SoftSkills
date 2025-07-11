const cron = require('node-cron');
const { Op } = require('sequelize');
const Curso = require('../model/Curso');

const atualizarEstadoDosCursos = async () => {
  const agora = new Date();
  console.log(`[CRON] Iniciar atualização de estados e visibilidade dos cursos em: ${agora.toISOString()}`);
  
  try {
    // Atualizar cursos para 'A decorrer' (1)
    const [numUpdatedEmCurso] = await Curso.update(
      { estado: 1 },
      {
        where: {
          estado: { [Op.notIn]: [1, 2] }, // nao atualiza se 'Em curso' ou 'Terminado'
          dataInicio: { [Op.lte]: agora }, //  hoje ou anterior
          dataFim: { [Op.gt]: agora },     // depois de hoje
        },
      }
    );
    if (numUpdatedEmCurso > 0) {
      console.log(`[CRON] ${numUpdatedEmCurso} curso(s) atualizado(s) para 'Em curso' (1).`);
    }

    // Atualizar cursos 'Terminado' (2) 
    // Cursos SÍNCRONOS -> estado: 2, visibilidadeStatus: 'arquivado'
    const [numArquivadosPresenciais] = await Curso.update(
      { estado: 2, visibilidadeStatus: 'arquivado' },
      {
        where: {
          tipoCurso: 'Presencial',       
          dataFim: { [Op.lte]: agora },   // já terminaram
          estado: { [Op.ne]: 2 },        //  ainda não terminaram
        },
      }
    );
    if (numArquivadosPresenciais > 0) {
      console.log(`[CRON] ${numArquivadosPresenciais} curso(s) presencial(ais) terminado(s) e arquivado(s).`);
    }

    // Cursos ASSINCRONOS -> estado: 2, visibilidadeStatus: 'oculto'
    const [numOcultosOnline] = await Curso.update(
      { estado: 2, visibilidadeStatus: 'oculto' },
      {
        where: {
          tipoCurso: 'Online',           
          dataFim: { [Op.lte]: agora },   // já terminaram
          estado: { [Op.ne]: 2 },        //  ainda não terminaram
        },
      }
    );
    if (numOcultosOnline > 0) {
      console.log(`[CRON] ${numOcultosOnline} curso(s) online terminado(s) e ocultado(s).`);
    }

  
    await Curso.update(
      { visibilidadeStatus: 'visivel' }, 
      {
        where: {
          estado: 2,
          tipoCurso: { [Op.notIn]: ['Online', 'Presencial'] }, 
          visibilidadeStatus: { [Op.ne]: 'visivel' }
        }
      }
    );


  } catch (error) {
    console.error("[CRON ERROR] Erro ao atualizar estados/visibilidade dos cursos:", error);
  } finally {
    console.log(`[CRON] Concluída a atualização em: ${new Date().toISOString()}`);
  }
};


// Corre todos os dias à meia-noite
cron.schedule('0 0 * * *', () => {
  atualizarEstadoDosCursos();
}, {
  timezone: "Europe/Lisbon"
});

module.exports = atualizarEstadoDosCursos;