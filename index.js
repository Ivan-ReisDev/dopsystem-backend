import express from "express"
import cors from "cors"
import bodyParser from "body-parser" 
import AppRoutes from "./src/routes/router.js";
import { connectdb } from "./src/DB/connect.js"

const port = process.env.PORT_APP || 3000;

const app = express();

// Configuração do CORS
app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

connectdb();

app.use('/api', AppRoutes);

app.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});
//aa