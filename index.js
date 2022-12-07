import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import linkRouter from "./routes/link.route.js"
import redirectRouter from "./routes/redirect.route.js"
const app = express();

const whiteList = [process.env.ORIGIN1]
app.use(cors({

    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            return callback(null, origin);
        }
        return callback("Origin: " + origin + " " + "No Autorizado por CORS");
    }
}));



app.use(cookieParser());
app.use(express.json());

//ejemplo de un redirect backend
app.use('/', redirectRouter);
//
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/links", linkRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("😍😍 http://localhost:" + PORT));