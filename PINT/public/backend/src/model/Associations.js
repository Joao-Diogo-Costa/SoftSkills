const AreaC = require("./AreaC");
const AulaSincrona = require("./AulaSincrona");
const AulaAssincrona = require("./AulaAssincrona");
const AvaliacaoCursoUtilizador = require("./AvaliacaoCursoUtilizador");
const AvisoCurso = require("./AvisoCurso");
const CategoriaC = require("./CategoriaC");
const Certificado = require("./Certificado");
const Comentario = require("./Comentario");
const Conteudo = require("./Conteudo");
const ConteudoFicheiro = require("./ConteudoFicheiro");
const Curso = require("./Curso");
const Denuncia = require("./Denuncia");
const DocumentoAula = require("./DocumentoAula");
const Forum = require("./Forum");
const ForumFicheiro = require("./ForumFicheiro");
const Inscricao = require("./Inscricao");
const Notificacao = require("./Notificacao");
const SubmissaoTarefa = require("./SubmissaoTarefa");
const SugestaoForum = require("./SugestaoForum");
const Tarefa = require("./Tarefa");
const TarefaFicheiro = require("./TarefaFicheiro");
const TopicoC = require("./TopicoC");
const Utilizador = require("./Utilizador");

// AreaC
AreaC.belongsTo(CategoriaC, { foreignKey: "categoriaId" });
AreaC.hasMany(TopicoC, { foreignKey: "areaId" });

// AulaAssincrona
AulaAssincrona.belongsTo(Curso, { foreignKey: "cursoId" });

// AulaSincrona
AulaSincrona.belongsTo(Curso, { foreignKey: "cursoId" });

// AvaliacaoCursoUtilizador
AvaliacaoCursoUtilizador.belongsTo(Utilizador, { foreignKey: 'utilizadorId'});
Utilizador.hasMany(AvaliacaoCursoUtilizador, { foreignKey: 'utilizadorId'});
AvaliacaoCursoUtilizador.belongsTo(Curso, { foreignKey: 'cursoId'});
Curso.hasMany(AvaliacaoCursoUtilizador, { foreignKey: 'cursoId' });

// AvisoCurso
AvisoCurso.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });
Utilizador.hasMany(AvisoCurso, { foreignKey: 'utilizadorId' });
AvisoCurso.belongsTo(Curso, { foreignKey: 'cursoId'});
Curso.hasMany(AvisoCurso, { foreignKey: 'cursoId', as: 'avisos'});

// CategoriaC
CategoriaC.hasMany(AreaC, { foreignKey: 'categoriaId'});

// Certificado
Certificado.belongsTo(Inscricao, { foreignKey: 'inscricaoId'});
Inscricao.hasOne(Certificado, { foreignKey: 'inscricaoId' });

// Comentario
Comentario.belongsTo(Forum, { foreignKey: 'forumId'});
Forum.hasMany(Comentario, { foreignKey: 'forumId' });
Comentario.belongsTo(Utilizador, { foreignKey: 'utilizadorId', as: 'Utilizador' });
Utilizador.hasMany(Comentario, { foreignKey: 'utilizadorId' });

// Conteudo
Curso.hasMany(Conteudo, { foreignKey: 'cursoId', as: 'conteudos' });
Conteudo.belongsTo(Curso, { foreignKey: 'cursoId' });

//ConteudoFicheiro
ConteudoFicheiro.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });
ConteudoFicheiro.belongsTo(Conteudo, { foreignKey: 'conteudoId' });
Utilizador.hasMany(ConteudoFicheiro, { foreignKey: 'utilizadorId' });
Conteudo.hasMany(ConteudoFicheiro, { foreignKey: 'conteudoId', as: 'ficheiros' });

// Curso 
Curso.belongsTo(TopicoC, { foreignKey: 'topicoId'});
TopicoC.hasMany(Curso, { foreignKey: 'topicoId',});

// Denuncia
Denuncia.belongsTo(Utilizador, { foreignKey: "utilizadorId", as: "Utilizador" });
Utilizador.hasMany(Denuncia, { foreignKey: "utilizadorId" });

Denuncia.belongsTo(Comentario, { foreignKey: "comentarioId", as: "Comentario" });
Comentario.hasMany(Denuncia, { foreignKey: "comentarioId"});

// DocumentoAula
DocumentoAula.belongsTo(AulaAssincrona, { foreignKey: 'aulaAssincronaId'});
AulaAssincrona.hasMany(DocumentoAula, { foreignKey: 'aulaAssincronaId'});

// Forum
Forum.belongsTo(TopicoC, { foreignKey: "topicoId"});
TopicoC.hasMany(Forum, { foreignKey: "topicoId"});

// ForumFicheiro
ForumFicheiro.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });
ForumFicheiro.belongsTo(Forum, { foreignKey: 'forumId' });
Forum.hasMany(ForumFicheiro, { foreignKey: 'forumId' });
Utilizador.hasMany(ForumFicheiro, { foreignKey: 'utilizadorId' });

// Inscricao
Inscricao.belongsTo(Utilizador, { foreignKey: "utilizadorId" });
Utilizador.hasMany(Inscricao, { foreignKey: "utilizadorId"});

Inscricao.belongsTo(Curso, { foreignKey: "cursoId" });
Curso.hasMany(Inscricao, { foreignKey: "cursoId" });

// Notificacao
Notificacao.belongsTo(Utilizador, { foreignKey: "utilizadorId"});
Utilizador.hasMany(Notificacao, { foreignKey: "utilizadorId" });

Notificacao.belongsTo(Curso, { foreignKey: "cursoId"});
Curso.hasMany(Notificacao, { foreignKey: "cursoId" });

// SubmissaoTarefa
SubmissaoTarefa.belongsTo(Utilizador, { foreignKey: "utilizadorId"});
Utilizador.hasMany(SubmissaoTarefa, { foreignKey: "utilizadorId" });

SubmissaoTarefa.belongsTo(Tarefa, { foreignKey: "idTarefa" });
Tarefa.hasMany(SubmissaoTarefa, { foreignKey: "idTarefa" });

// SugestaoForum 
SugestaoForum.belongsTo(Utilizador, { foreignKey: "utilizadorId"});
Utilizador.hasMany(SugestaoForum, { foreignKey: "utilizadorId"});
SugestaoForum.belongsTo(TopicoC, { foreignKey: "topicoId", });
TopicoC.hasMany(SugestaoForum, { foreignKey: "topicoId" });

// Tarefa
Tarefa.belongsTo(Curso, { foreignKey: "cursoId" });
Curso.hasMany(Tarefa, { foreignKey: "cursoId", as: 'tarefas' });
Tarefa.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });
Utilizador.hasMany(Tarefa, { foreignKey: 'utilizadorId' });

// TarefaFicheiro
Tarefa.hasMany(TarefaFicheiro, { foreignKey: "tarefaId", as: "ficheiros"});
TarefaFicheiro.belongsTo(Tarefa, { foreignKey: "tarefaId" });

// TopicoC
TopicoC.belongsTo(AreaC, { foreignKey: "areaId" });
AreaC.hasMany(TopicoC, { foreignKey: "areaId"});

// Utilizador
Curso.belongsTo(Utilizador, {foreignKey: "formadorId", as:"formador"});
Utilizador.hasMany(Curso, {foreignKey: "formadorId",});


module.exports = {
  CategoriaC,
  AreaC,
  TopicoC,
  Utilizador,
  Curso,
  AulaSincrona,
  AulaAssincrona,
  DocumentoAula,
  Conteudo,
  ConteudoFicheiro,
  Inscricao,
  Certificado,
  AvaliacaoCursoUtilizador,
  AvisoCurso,
  Notificacao,
  Forum,
  ForumFicheiro,
  Comentario,
  Denuncia,
  SugestaoForum,
  Tarefa,
  SubmissaoTarefa,
};
