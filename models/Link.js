import mongoose from "mongoose";
const { Schema } = mongoose;

const linkSchema = new Schema({
    longLink: { //link original
        type: String,
        required: true,
        trim: true,
    },
    nanoLink: { //link acortado
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    uid: {
        type: Schema.Types.ObjectId, //el tipo va a ser igual al ID cuando se crea en mongo db
        ref: "User", //la referencia de nuestro modelo, en este caso User
        required: true,
    },
});

export const Link = mongoose.model("Link", linkSchema);