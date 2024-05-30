// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const app = express();

// const port = process.env.PORT_APP || 3000;

// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// app.use(cors());
// app.use(express.json());

// const connectdb = require('./src/DB/connect.js');
// connectdb();
// const routes = require('./src/routes/router.js');
// app.use('/api', routes);

// app.listen(port, function() {
//     console.log(`Server online na porta ${port}, acesse: http://localhost:${port}/`);
// });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https")
const router = require("./src/routes/service")

// Porta para servidor HTTP
const port = process.env.PORT_APP || 3000;

// Porta para servidor HTTPS
const httpsPort = 443;

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cors());
const connectdb = require('./src/DB/connect.js');
connectdb();
app.use('/api', router);

// Inicializa o servidor HTTP
app.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});

// Verifica se os certificados SSL estão disponíveis antes de inicializar o servidor HTTPS
if (fs.existsSync("src/SSL/code.crt") && fs.existsSync("src/SSL/code.key")) {
  https.createServer({
    cert: fs.readFileSync("src/SSL/code.crt"),
    key: fs.readFileSync("src/SSL/code.key")
  }, app).listen(httpsPort, () => {
    console.log(`Servidor HTTPS rodando na porta ${httpsPort}`);
  });
} else {
  console.log("Certificados SSL não encontrados. Servidor HTTPS não será iniciado.");
}