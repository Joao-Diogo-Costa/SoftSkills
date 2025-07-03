const { Curso, AulaAssincrona, DocumentoAula } = require("../model");
const { Op } = require("sequelize");

async function renovarCursosAssincronos() {
  const hoje = new Date();

  // 1. Encontrar cursos assíncronos terminados e ainda visíveis
  const cursos = await Curso.findAll({
    where: {
      tipoCurso: "Online",
      dataFim: { [Op.lt]: hoje },
      estado: 2, // Terminado
      visibilidadeStatus: "visivel"
    }
  });

  for (const curso of cursos) {
    // 2. Criar novo curso (cópia)
    const dataUpload = new Date();
    const dataInicio = new Date(dataUpload);
    dataInicio.setMonth(dataInicio.getMonth() + 1);
    const dataFim = new Date(dataInicio);
    dataFim.setMonth(dataFim.getMonth() + 1);

    const cursoData = curso.toJSON();
    delete cursoData.id;
    cursoData.dataUpload = dataUpload;
    cursoData.dataInicio = dataInicio;
    cursoData.dataFim = dataFim;
    cursoData.estado = 0; // pendente
    cursoData.visibilidadeStatus = "visivel";
    cursoData.previousCursoId = curso.id;
    cursoData.numParticipante = 0;

    const novoCurso = await Curso.create(cursoData);

    // 3. Copiar aulas assíncronas e respetivos documentos
    const aulas = await AulaAssincrona.findAll({ where: { cursoId: curso.id } });
    for (const aula of aulas) {
      const aulaData = aula.toJSON();
      const oldAulaId = aulaData.id;
      delete aulaData.id;
      aulaData.cursoId = novoCurso.id;

      const novaAula = await AulaAssincrona.create(aulaData);

      // Copiar documentos da aula, se existirem
      const docs = await DocumentoAula.findAll({ where: { aulaAssincronaId: oldAulaId } });
      for (const doc of docs) {
        const docData = doc.toJSON();
        delete docData.id;
        docData.aulaAssincronaId = novaAula.id;
        await DocumentoAula.create(docData);
      }
    }

    await curso.update({ visibilidadeStatus: "oculto" });
  }
}

module.exports = renovarCursosAssincronos;