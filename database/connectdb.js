import mongoose from "mongoose";
//evitar el deprecated warning
mongoose.set('strictQuery', false);
try {
    await mongoose.connect(process.env.DB_URI);
    console.log("😎😎 db conectada");
} catch (error) {
    console.log("😒😒" + error);
}