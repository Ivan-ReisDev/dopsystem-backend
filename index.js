const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const router = require('./src/routes/service');

// Porta para servidor HTTP
const port = process.env.PORT_APP || 3000;

// Porta para servidor HTTPS
const httpsPort = 443;

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser()); // Adiciona suporte para parsing de cookies

// Configurações de CORS para permitir cookies
app.use(cors({
  origin: 'https://policiadop.com.br/', // Altere para o domínio da sua aplicação cliente
  credentials: true
}));

const connectdb = require('./src/DB/connect.js');
connectdb();
app.use('/api', router);

// Inicializa o servidor HTTP
app.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});

// Verifica se os certificados SSL estão disponíveis antes de inicializar o servidor HTTPS
if (fs.existsSync('src/SSL/code.crt') && fs.existsSync('src/SSL/code.key')) {
  https.createServer({
    cert: fs.readFileSync('src/SSL/code.crt'),
    key: fs.readFileSync('src/SSL/code.key')
  }, app).listen(httpsPort, () => {
    console.log(`Servidor HTTPS rodando na porta ${httpsPort}`);
  });
} else {
  console.log('Certificados SSL não encontrados. Servidor HTTPS não será iniciado.');
}
