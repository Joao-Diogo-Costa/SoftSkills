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
const Forum = require("./Forum");
const Inscricao = require("./Inscricao");
const Notificacao = require("./Notificacao");
const SubmissaoTarefa = require("./SubmissaoTarefa");
const SugestaoForum = require("./SugestaoForum");
const Tarefa = require("./Tarefa");
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
Curso.hasMany(AvisoCurso, { foreignKey: 'cursoId'});

// CategoriaC
CategoriaC.hasMany(AreaC, { foreignKey: 'categoriaId'});

// Certificado
Certificado.belongsTo(Inscricao, { foreignKey: 'inscricaoId'});
Inscricao.hasOne(Certificado, { foreignKey: 'inscricaoId' });

// Comentario
Comentario.belongsTo(Forum, { foreignKey: 'forumId'});
Forum.hasMany(Comentario, { foreignKey: 'forumId' });
Comentario.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });
Utilizador.hasMany(Comentario, { foreignKey: 'utilizadorId' });

// Conteudo
Curso.hasMany(Conteudo, { foreignKey: 'cursoId' });
Conteudo.belongsTo(Curso, { foreignKey: 'cursoId' });

// Curso 
Curso.belongsTo(TopicoC, { foreignKey: 'topicoId'});
TopicoC.hasMany(Curso, { foreignKey: 'topicoId',});

// Denuncia
Denuncia.belongsTo(Utilizador, { foreignKey: "utilizadorId"});
Utilizador.hasMany(Denuncia, { foreignKey: "utilizadorId" });

Denuncia.belongsTo(Comentario, { foreignKey: "comentarioId"});
Comentario.hasMany(Denuncia, { foreignKey: "comentarioId"});

// DocumentoAula
DocumentoAula.belongsTo(AulaAssincrona, { foreignKey: 'aulaAssincronaId'});
AulaAssincrona.hasMany(DocumentoAula, { foreignKey: 'aulaAssincronaId'});

// Forum
Forum.belongsTo(TopicoC, { foreignKey: "topicoId"});
TopicoC.hasMany(Forum, { foreignKey: "topicoId"});

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

// Tarefa
Tarefa.belongsTo(AulaSincrona, { foreignKey: "idAulaSinc" });
AulaSincrona.hasMany(Tarefa, { foreignKey: "idAulaSinc" });

// TopicoC
TopicoC.belongsTo(AreaC, { foreignKey: "areaId" });
AreaC.hasMany(TopicoC, { foreignKey: "areaId"});

// Utilizador


module.exports = {
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
  SugestaoForum,
  SubmissaoTarefa,
  DocumentoAula,
};
