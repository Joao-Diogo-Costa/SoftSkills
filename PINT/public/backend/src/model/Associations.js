const AreaC = require("./AreaC");
const AulaSincrona = require("./AulaSincrona");
const AulaAssincrona = require("./AulaAssincrona");
const Avaliacao = require("./Avaliacao");
const AvaliacaoCurso = require("./AvaliacaoCurso");
const Aviso = require("./Aviso");
const CategoriaC = require("./CategoriaC");
const Certificado = require("./Certificado");
const Comentario = require("./Comentario");
const Conteudo = require("./Conteudo");
const Curso = require("./Curso");
const CursoGestor = require("./CursoGestor");
const Denuncia = require("./Denuncia");
const DocumentoAula = require("./DocumentoAula");
const DocumentoForum = require("./DocumentoForum");
const Formador = require("./Formador");
const Formando = require("./Formando");
const Forum = require("./Forum");
const Gestor = require("./Gestor");
const Inscricao = require("./Inscricao");
const InscricaoCurso = require("./InscricaoCurso");
const Notificacao = require("./Notificacao");
const SubmissaoTarefa = require("./SubmissaoTarefa");
const SugestaoTopico = require("./SugestaoTopico");
const Tarefa = require("./Tarefa");
const Topico = require("./Topico");
const TopicoC = require("./TopicoC");
const Utilizador = require("./Utilizador");



//AreaC
AreaC.belongsTo(CategoriaC, { foreignKey: "categoriaId" });
AreaC.hasMany(TopicoC, { foreignKey: "areaId" });

//AulaAssincrona
AulaAssincrona.belongsTo(Gestor, { foreignKey: "gestorId" });
AulaAssincrona.belongsTo(Curso, { foreignKey: "cursoId" });

//AulaSincrona
AulaSincrona.belongsTo(Curso, { foreignKey: "cursoId" });
AulaSincrona.belongsTo(Gestor, { foreignKey: "gestorId" });

//Avaliacao
Avaliacao.belongsTo(Formador, { foreignKey: "formadorId" });
Avaliacao.belongsTo(Formando, { foreignKey: "formandoId" });

Avaliacao.belongsToMany(Curso, {
  through: AvaliacaoCurso,
  foreignKey: "avaliacaoId",
  otherKey: "cursoId",
});

//AvaliacaoCurso
Avaliacao.belongsToMany(Curso, {
  through: AvaliacaoCurso,
  foreignKey: "avaliacaoId",
  otherKey: "cursoId",
});

Curso.belongsToMany(Avaliacao, {
  through: AvaliacaoCurso,
  foreignKey: "cursoId",
  otherKey: "avaliacaoId",
});

//Aviso
Aviso.belongsTo(AulaAssincrona, { foreignKey: "aulaAssincronaId" });
Aviso.belongsTo(AulaSincrona, { foreignKey: "aulaSincronaId" });
Aviso.belongsTo(Formador, { foreignKey: "formadorId" });

//CategoriaC
CategoriaC.hasMany(AreaC, { foreignKey: "categoriaId" }); 

//Certificado
Certificado.belongsTo(Formando, { foreignKey: "formandoId" });

//Comentario
Comentario.belongsTo(Forum, { foreignKey: "forumId" });
Comentario.belongsTo(Formando, { foreignKey: "formandoId" });

//Conteudo
Conteudo.belongsTo(Curso, { foreignKey: "cursoId" });

// Curso
Curso.belongsTo(Formador, { foreignKey: "formadorId" });
Curso.belongsTo(CategoriaC, { foreignKey: "categoriaId" });
Curso.belongsTo(AreaC, { foreignKey: "areaId" }); 
Curso.belongsTo(TopicoC, { foreignKey: "topicoId" }); 

Curso.belongsToMany(Gestor, {
  through: CursoGestor,
  foreignKey: "cursoId",
  otherKey: "gestorId",
});

Curso.belongsToMany(Avaliacao, {
  through: AvaliacaoCurso,
  foreignKey: "cursoId",
  otherKey: "avaliacaoId",
});

Curso.belongsToMany(Inscricao, {
  through: InscricaoCurso,
  foreignKey: "cursoId",
  otherKey: "inscricaoId",
});

//CursoGestor
CursoGestor.belongsTo(Curso, { foreignKey: "cursoId" });
CursoGestor.belongsTo(Gestor, { foreignKey: "gestorId" });


//Denuncia
Denuncia.belongsTo(Comentario, { foreignKey: "comentarioId" });

//DocumentoAula
DocumentoAula.belongsTo(AulaAssincrona, { foreignKey: "aulaAssincronaId" });

//DocumentoForum
DocumentoAula.belongsTo(AulaAssincrona, { foreignKey: "aulaAssincronaId" });

//Formador
Formador.belongsTo(Gestor, { foreignKey: "gestorId" });
Formador.belongsTo(Utilizador, {foreignKey: "utilizadorId" });

//Formando
Formando.belongsTo(Gestor, { foreignKey: "gestorId" });
Formando.belongsTo(Utilizador, {foreignKey: "utilizadorId"});

//Forum
Forum.belongsTo(Topico, { foreignKey: "topicoId" });

//Gestor
Gestor.belongsToMany(Curso, {
  through: CursoGestor,
  foreignKey: "gestorId",
  otherKey: "cursoId",
  as: "cursosGeridos"
});

Gestor.belongsTo(Utilizador, {foreignKey: "utilizadorId" });
  
//Inscricao
Inscricao.belongsTo(Formando, { foreignKey: "formandoId" });

Inscricao.belongsToMany(Curso, {
    through: InscricaoCurso,
    foreignKey: "inscricaoId",
    otherKey: "cursoId",
  });


//InscricaoCurso

//Notificacao
Notificacao.belongsTo(Gestor, { foreignKey: "gestorId" });
Notificacao.belongsTo(Formador, { foreignKey: "formadorId" });
Notificacao.belongsTo(Formando, { foreignKey: "formandoId" });

//SubmissaoTarefa
SubmissaoTarefa.belongsTo(Tarefa, { foreignKey: "idTarefa" });

//SugestaoTopico
SugestaoTopico.belongsTo(Formando, { foreignKey: "formandoId" });
SugestaoTopico.belongsTo(CategoriaC, { foreignKey: "categoriaId" });
SugestaoTopico.belongsTo(AreaC, { foreignKey: "areaId" });

//Tarefa
Tarefa.belongsTo(AulaSincrona, { foreignKey: "idAulaSinc" });
Tarefa.hasMany(SubmissaoTarefa, { foreignKey: 'idTarefa' });

//Topico
Topico.belongsTo(Gestor, { foreignKey: "gestorId" });
Topico.belongsTo(CategoriaC, { foreignKey: "categoriaId" });


//TopicoC
TopicoC.belongsTo(AreaC, { foreignKey: "areaId" });

//Utilizador
Utilizador.hasOne(Formador, { foreignKey: "utilizadorId" });
Utilizador.hasOne(Formando, { foreignKey: "utilizadorId" });
Utilizador.hasOne(Gestor, { foreignKey: "utilizadorId" });

module.exports = {
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
};