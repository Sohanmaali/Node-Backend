// require('dotenv').config();
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

// console.log(process.env.MONGODB_URI);
connectDB()
        .then((result) => {
                app.listen(process.env.PORT || 3300, () => {
                        console.log(
                                `Server is running at port : ${process.env.PORT}`
                        );
                });
                console.log("DB Connected ", result);
        })
        .catch((err) => {
                console.log("MognoDB Fail to connect !!!", err);
        });

/*
import express from "express";
const app = express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        app.on("Error ", (error) => {
            console.log("Error ", error);
            throw error;
        });
        app.listen(process.env.PORT, () => {
            console.log(`I am Listning on ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("ERROR  ", error);
    }
})();
*/
