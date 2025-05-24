const sequelize = require("./database");

// Importa todos os modelos na ordem correta
const AreaC = require("./AreaC");
const AulaSincrona = require("./AulaSincrona");
const AulaAssincrona = require("./AulaAssincrona");
const AvaliacaoCursoUtilizador = require("./AvaliacaoCursoUtilizador");
const AvisoCurso = require("./AvisoCurso");
const CategoriaC = require("./CategoriaC");
const Certificado = require("./Certificado");
const Comentario = require("./Comentario");
const Conteudo = require("./Conteudo");
const Curso = require("./Curso");
const Denuncia = require("./Denuncia");
const DocumentoAula = require("./DocumentoAula");
const DocumentoForum = require("./DocumentoForum");
const Forum = require("./Forum");
const Inscricao = require("./Inscricao");
const Notificacao = require("./Notificacao");
const SubmissaoTarefa = require("./SubmissaoTarefa");
const SugestaoForum = require("./SugestaoForum");
const Tarefa = require("./Tarefa");
const TopicoC = require("./TopicoC");
const Utilizador = require("./Utilizador");


// Aplica as associações
require("./Associations"); // Certifica-te que este ficheiro define os belongsTo, hasMany, etc.

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Ligação com a base de dados estabelecida.");

    const models = [
      Utilizador,
      CategoriaC,
      AreaC,
      TopicoC,
      Curso,
      AulaSincrona,
      AulaAssincrona,
      Tarefa,
      Conteudo,
      Inscricao,
      Certificado,
      AvaliacaoCursoUtilizador,
      AvisoCurso,
      Notificacao,
      Forum,
      Comentario,
      Denuncia,
      DocumentoForum,
      SugestaoForum,
      SubmissaoTarefa,
      DocumentoAula,
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