import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import {
    generateToken,
    generateRefreshToken,
} from "../helpers/generateTokens.js";
import { errorTokens } from "../helpers/errorsToken.js";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) throw {code: 11000};

        user = new User({ email, password });
        await user.save();

        // Generar token
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);
        return res.json({ token, expiresIn });
        // return res.status(201).json({ok: "usuario creado"});
    } catch (error) {
        console.log(error);
        //codigo por defecto moongose
        if(error.code === 11000){
            return res.status(400).json({error: "Ya existe este usuario"});
        }
         return res.status(500).json({ error: "Error de servidor" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);

        let user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            throw new Error("Email or password is incorrect");

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);
        
        return res.json({ token, expiresIn });
        // return res.json({ ok: "Autenticado" });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: error.message });
    }
};

export const infoUser = async (req, res) => {
    try {
        //devuelve un objeto simple
        const user = await User.findById(req.uid).lean();
        delete user.password;
        return res.json({ user });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    // https://stackoverflow.com/questions/27978868/destroy-cookie-nodejs
    res.clearCookie("refreshToken");
    return res.json({ ok: true });
};

export const refreshToken = (req, res) => {
    try {
        const { token, expiresIn } = generateToken(req.uid);
        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error de server" });
    }
};

