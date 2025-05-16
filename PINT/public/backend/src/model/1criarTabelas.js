const sequelize = require("./database");

// Importa todos os modelos na ordem correta
const Utilizador = require("./Utilizador");
const Gestor = require("./Gestor");
const Formador = require("./Formador");
const Formando = require("./Formando");
const CategoriaC = require("./CategoriaC");
const AreaC = require("./AreaC");
const TopicoC = require("./TopicoC");
const Curso = require("./Curso");
const AulaSincrona = require("./AulaSincrona");
const AulaAssincrona = require("./AulaAssincrona");
const Tarefa = require("./Tarefa");
const SubmissaoTarefa = require("./SubmissaoTarefa");
const Forum = require("./Forum");
const Comentario = require("./Comentario");
const Denuncia = require("./Denuncia");
const DocumentoAula = require("./DocumentoAula");
const DocumentoForum = require("./DocumentoForum");
const Conteudo = require("./Conteudo");
const CursoGestor = require("./CursoGestor");
const Inscricao = require("./Inscricao");
const InscricaoCurso = require("./InscricaoCurso");
const Avaliacao = require("./Avaliacao");
const AvaliacaoCurso = require("./AvaliacaoCurso");
const Aviso = require("./Aviso");
const Certificado = require("./Certificado");
const Notificacao = require("./Notificacao");
const SugestaoTopico = require("./SugestaoTopico");
const Topico = require("./Topico");

// Aplica as associações
require("./Associations"); // Certifica-te que este ficheiro define os belongsTo, hasMany, etc.

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Ligação com a base de dados estabelecida.");

    const models = [
      Utilizador,
      Gestor,
      Formador,
      Formando,
      CategoriaC,
      AreaC,
      TopicoC,
      Curso,
      AulaSincrona,
      AulaAssincrona,
      Tarefa,
      SubmissaoTarefa,
      Topico,
      Forum,
      Comentario,
      Denuncia,
      DocumentoAula,
      DocumentoForum,
      Conteudo,
      CursoGestor,
      Inscricao,
      InscricaoCurso,
      Avaliacao,
      AvaliacaoCurso,
      Aviso,
      Certificado,
      Notificacao,
      SugestaoTopico,
    ];

    // Cria as tabelas uma a uma na ordem definida
    for (const model of models) {
      await model.sync({ force: true }); // force: true apaga e recria
      console.log(`Tabela ${model.name} criada/sincronizada.`);
    }

    console.log("Todas as tabelas foram criadas com sucesso.");
    process.exit(); // Termina o script
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
    process.exit(1);
  }
})();