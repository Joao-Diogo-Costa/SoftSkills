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

app.listen(app.get("port"), () => {
  console.log("Start server on port " + app.get("port"));
});
