import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectdb = async () => {
    try {
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASSK;
        const dbName = process.env.DB_NAMEK;
        const dbHost = process.env.DB_HOST;

        mongoose.set("strictQuery", true);

        const uri = `mongodb://${dbUser}:${encodeURIComponent(dbPassword)}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //serverSelectionTimeoutMS: 600000  
        });

        console.log("Banco Conectado", mongoose.connection.host);
    } catch (error) {
        console.log(`error: ${error}`);
    }
}
