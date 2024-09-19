import mongoose from "mongoose";

interface Options {
    mongo_url: string;
    db_name: string;
}

export class MongoDatabase {

    static async connect (options: Options) {
        const { mongo_url, db_name } = options;

        try {
            await mongoose.connect(mongo_url, {
                dbName: db_name
            });

            console.log('Mongo connected');
        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }
    }
    
}