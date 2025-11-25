const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const API_PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas externas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/narrador", require("./routes/narrador"));
app.use("/api/deepweb", require("./routes/deepweb"));
app.use("/api/labs", require("./routes/labs"));
app.use("/api/conquistas", require("./routes/conquistas"));
app.use("/api/docker", require("./routes/docker"));

app.listen(API_PORT, () => {
  console.log(`DarkAccess backend rodando na porta ${API_PORT}`);
});
