const mongoose = require("mongoose");
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;

async function main() {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(`mongodb://${dbUser}:${encodeURIComponent(dbPassword)}@${dbHost}/${dbName}?retryWrites=true&w=majority`);

        console.log("Banco Conectado:", mongoose.connection.host);
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
    }
}

module.exports = main;
