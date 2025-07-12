const express = require("express");
var cors = require('cors')
const sequelize = require('./model/database.js');
const app = express();
const initializeData = require('./model/insert.js');
require("dotenv").config();

require('./model/Associations.js');
const cronCurso = require('./cron/atualizarEstadoCurso.js');

//Configurações
app.set("port", process.env.PORT || 3000);

// Configurar CORS
app.use(cors())

//Middlewares
app.use(express.json());

//Rotas
const authRoute = require("./routes/authRoute");
app.use("/auth", authRoute);

const areaRoute = require("./routes/areacRoute");
app.use("/area", areaRoute);

const aulaAssincronaRoute = require("./routes/aulaAssincronaRoute");
app.use("/aula-assincrona", aulaAssincronaRoute );

const aulaSincronaRoute = require("./routes/aulaSincronaRoute");
app.use("/aula-sincrona", aulaSincronaRoute);

const avaliacaoRoute = require("./routes/avaliacaoCursoUtilizadorRoute");
app.use("/avaliacao", avaliacaoRoute);


const avalicaoForumUtilizadorRoute = require("./routes/avalicaoForumUtilizadorRoute");
app.use("/avaliacao-forum", avalicaoForumUtilizadorRoute);

const avisoRoute = require("./routes/avisoRoute");
app.use("/aviso", avisoRoute);

const categoriacRoute = require("./routes/categoriacRoute");
app.use("/categoria", categoriacRoute);

const certificadoRoute = require("./routes/certificadoRoute");
app.use("/certificado", certificadoRoute);

const comentarioRoute = require("./routes/comentarioRoute");
app.use("/comentario", comentarioRoute);

const conteudoRoute = require("./routes/conteudoRoute");
app.use("/conteudo", conteudoRoute);

const conteudoFicheiroRoute = require("./routes/conteudoFicheiroRoute");
app.use("/conteudo-ficheiro", conteudoFicheiroRoute);

const cursoRoute = require("./routes/cursoRoute");
app.use("/curso", cursoRoute);

const denunciaRoute = require("./routes/denunciaRoute");
app.use("/denuncia", denunciaRoute);

const documentoAulaRoute = require("./routes/documentoAulaRoute");
app.use("/documento-aula", documentoAulaRoute);

const forumRoute = require("./routes/forumRoute");
app.use("/forum", forumRoute);

const forumFicheiroRoute = require("./routes/forumFicheiroRoute");
app.use("/forum-ficheiro", forumFicheiroRoute);

const inscricaoRoute = require("./routes/inscricaoRoute");
app.use("/inscricao", inscricaoRoute);

const notificacaoRoute = require("./routes/notificacaoRoute");
app.use("/notificacao", notificacaoRoute);

const progressoAulaAssincrona = require("./routes/progressoAulaAssincronaRoute.js");
app.use("/progresso-aula", progressoAulaAssincrona)

const statRoute = require('./routes/statRoute');
app.use('/estatistica', statRoute);

const sugestaoTopicoRoute = require("./routes/sugestaoTopicoRoute");
app.use("/sugestao-topico", sugestaoTopicoRoute);

const tarefaRoute = require("./routes/tarefaRoute");
app.use("/tarefa", tarefaRoute);

const tarefaFicheiroRoute = require("./routes/tarefaFicheiroRoute");
app.use("/tarefa-ficheiro", tarefaFicheiroRoute);

const submissaoTarefaRoute = require("./routes/submissaoTarefaRoute.js");
app.use("/submissao-tarefa", submissaoTarefaRoute);

const topicocRoute = require("./routes/topicocRoute");
app.use("/topico-curso", topicocRoute);

const utilizadorRoute = require("./routes/utilizadorRoute");
app.use("/utilizador", utilizadorRoute);

app.use("/", (req, res) => {
  res.send("API");
});


// Server

async function startServer() {
  try {
    // Sincroniza os modelos com o banco de dados
    await sequelize.sync()
    .then(() => {
      console.log("Tabelas criadas ou já existentes.");
    })
    .catch((error) => {
      console.error("Erro ao criar as tabelas:", error);
    });

    // Inicializa os dados
    await inicializarDados();

    app.listen(app.get("port"), () => {
      console.log("Start server on port " + app.get("port"));
    });

    cronCurso();

  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

async function inicializarDados() {
    await initializeData();
    console.log("Dados iniciais inseridos com sucesso.");
}

startServer();