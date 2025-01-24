import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectdb = async () => {
    try {
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASS;
        const dbHost = process.env.DB_HOST;
        
        mongoose.set("strictQuery", true);

        const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/?retryWrites=true&w=majority&appName=Cluster0`;;

        await mongoose.connect(url);

        console.log("Banco Conectado", mongoose.connection.host);
    } catch (error) {
        console.log(`error: ${error}`);
    }
}
