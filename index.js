const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const port =  process.env.PORT_APP || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());
app.use(express.json());

const connectdb = require('./src/DB/connect.js')
connectdb();
const routes = require('./src/routes/router.js')
app.use('/api', routes)

app.listen(3000, function(){
    console.log(`Server online na porta ${port}, acesse: http://localhost:${port}/` );
})