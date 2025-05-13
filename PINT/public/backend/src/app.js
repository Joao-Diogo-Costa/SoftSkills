const express = require("express");
var cors = require('cors')
const app = express();

//Configurações
app.set("port", process.env.PORT || 3000);

// Configurar CORS
app.use(cors())

//Middlewares
app.use(express.json());

//Rotas

app.use("/", (req, res) => {
  res.send("Hello World");
});

const areaRoutes = require("./routes/area");
app.use("/area", areaRoutes);

const aulaSincronaRoutes = require("./routes/aulaSincrona");
app.use("/aula-sincrona", aulaSincronaRoutes);

const avaliacaoRoutes = require("./routes/avaliacaoRoutes");
app.use("/avaliacao", avaliacaoRoutes);

const avisoRoutes = require("./routes/avisoRoutes");
app.use("/aviso", avisoRoutes);

const categoriaRoutes = require("./routes/categoriaRoutes");
app.use("/categoria", categoriaRoutes);

const certificadoRoutes = require("./routes/certificadoRoutes");
app.use("/certificado", certificadoRoutes);

const comentarioRoutes = require("./routes/comentarioRoutes");
app.use("/comentario", comentarioRoutes);

const conteudoRoutes = require("./routes/conteudoRoutes");
app.use("/conteudo", conteudoRoutes);

const cursoRoutes = require("./routes/cursoRoutes");
app.use("/curso", cursoRoutes);

const denunciaRoutes = require("./routes/denunciaRoutes");
app.use("/denuncia", denunciaRoutes);

const documentoAulaRoutes = require("./routes/documentoAulaRoutes");
app.use("/documento-aula", documentoAulaRoutes);

const documentoForumRoutes = require("./routes/documentoForumRoutes");
app.use("/documento-forum", documentoForumRoutes);

const formadorRoutes = require("./routes/formadorRoutes");
app.use("/formador", formadorRoutes);

const formandoRoutes = require("./routes/formandoRoutes");
app.use("/formando", formandoRoutes);

const forumRoutes = require("./routes/forumRoutes");
app.use("/forum", forumRoutes);

const gestorRoutes = require("./routes/gestorRoutes");
app.use("/gestor", gestorRoutes);

const inscricaoRoutes = require("./routes/inscricaoRoutes");
app.use("/inscricao", inscricaoRoutes);

const inscricaoCursoRoutes = require("./routes/inscricaoCursoRoutes");
app.use("/inscricao-curso", inscricaoCursoRoutes);

const notificacaoRoutes = require("./routes/notificacaoRoutes");
app.use("/notificacao", notificacaoRoutes);

const sugestaoRoutes = require("./routes/sugestaoRoutes");
app.use("/sugestao", sugestaoRoutes);

const tarefaRoutes = require("./routes/tarefaRoutes");
app.use("/tarefa", tarefaRoutes);

const topicoCRoutes = require("./routes/topicocRoutes");
app.use("/topico-curso", topicoCRoutes);

const topicoRoutes = require("./routes/topicoRoutes");
app.use("/topico", topicoRoutes);

app.listen(app.get("port"), () => {
  console.log("Start server on port " + app.get("port"));
});
