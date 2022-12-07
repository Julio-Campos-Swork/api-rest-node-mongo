import jwt from "jsonwebtoken";
import { errorTokens } from "../helpers/errorsToken.js";

export const validateToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        //  console.log("validateToken",req.headers)
        //  console.log("token",token)
        if (!token) throw new Error("No existe el token");

        token = token.split(" ")[1];
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
    } catch (error) {
        // console.log(error);
        return res.status(401).json({ error: errorTokens(error.message) });
    }
};

export const requireRefreshToken = (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) throw new Error("No existe el token");

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .send({ error: errorTokens[error.message] });
    }
};