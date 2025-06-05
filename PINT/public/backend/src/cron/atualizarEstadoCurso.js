const cron = require('node-cron');
const { Op } = require('sequelize');
const Curso = require('../model/Curso');

const atualizarEstadoDosCursos = async () => {
  const agora = new Date();
  console.log(`[CRON] Iniciar atualização de estados e visibilidade dos cursos em: ${agora.toISOString()}`);
  
  try {
    // 1. Atualizar cursos para 'Em curso' (1)
    const [numUpdatedEmCurso] = await Curso.update(
      { estado: 1 },
      {
        where: {
          estado: { [Op.notIn]: [1, 2] }, // Não atualiza se já estiver 'Em curso' ou 'Terminado'
          dataInicio: { [Op.lte]: agora }, // Data de início é hoje ou anterior
          dataFim: { [Op.gt]: agora },     // Data de fim é posterior a hoje
        },
      }
    );
    if (numUpdatedEmCurso > 0) {
      console.log(`[CRON] ${numUpdatedEmCurso} curso(s) atualizado(s) para 'Em curso' (1).`);
    }

    // 2. Atualizar cursos que terminaram para 'Terminado' (2) e definir visibilidade
    // Cursos SÍNCRONOS (Presenciais) que terminaram -> estado: 2, visibilidadeStatus: 'arquivado'
    const [numArquivadosPresenciais] = await Curso.update(
      { estado: 2, visibilidadeStatus: 'arquivado' },
      {
        where: {
          tipoCurso: 'Presencial',       // Apenas cursos presenciais
          dataFim: { [Op.lte]: agora },   // Que já terminaram
          estado: { [Op.ne]: 2 },        // E que ainda não estão 'Terminado'
        },
      }
    );
    if (numArquivadosPresenciais > 0) {
      console.log(`[CRON] ${numArquivadosPresenciais} curso(s) presencial(ais) terminado(s) e arquivado(s).`);
    }

    // Cursos ASSÍNCRONOS (Online) que terminaram -> estado: 2, visibilidadeStatus: 'oculto'
    const [numOcultosOnline] = await Curso.update(
      { estado: 2, visibilidadeStatus: 'oculto' },
      {
        where: {
          tipoCurso: 'Online',           // Apenas cursos online
          dataFim: { [Op.lte]: agora },   // Que já terminaram
          estado: { [Op.ne]: 2 },        // E que ainda não estão 'Terminado'
        },
      }
    );
    if (numOcultosOnline > 0) {
      console.log(`[CRON] ${numOcultosOnline} curso(s) online terminado(s) e ocultado(s).`);
    }

    // Opcional: Para qualquer curso que esteja no estado 2 (terminado) mas tenha um visibilidadeStatus inconsistente
    // Isso pode ser útil para corrigir dados antigos ou garantir que todos os cursos terminados sejam tratados.
    await Curso.update(
      { visibilidadeStatus: 'visivel' }, // Exemplo: Resetar visibilidade para qualquer outro curso terminado que não se encaixe nas regras acima.
      {
        where: {
          estado: 2,
          tipoCurso: { [Op.notIn]: ['Online', 'Presencial'] }, // Se houver outros tipos ou para garantir
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