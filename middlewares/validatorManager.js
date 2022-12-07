import { body, cookie, header, validationResult, param } from "express-validator";
import axios from 'axios'
const validationResultExpress = (req, res, next) => {
    const errors = validationResult(req);
    // console.log("validationResultExpress", errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

export const registerValidator = [
    body("email", "Formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Mínimo 6 carácteres")
        .trim()
        .isLength({ min: 6 }),
    body("password", "Formato de password incorrecta").custom(
        (value, { req }) => {
            if (value !== req.body.repassword) {
                throw new Error("No coinciden las contraseñas");
            }
            return value;
        }
    ),
    validationResultExpress,
];

export const loginValidator = [
    body("email", "Formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Mínimo 6 carácteres")
        .trim()
        .isLength({ min: 6 }),
    validationResultExpress,
];

export const tokenHeaderValidator = [
    header("authorization", "No existe el token")
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress,
];

export const tokenCookieValidator = [
    cookie("refreshToken", "No existe refresh Token")
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress,
];

export const paramLinkValidator = [
    
    param("id", "Formato no valido (ExVa)").trim().notEmpty().escape(),
    validationResultExpress
];

export const linkValidator = [
    body("longLink", "Formato Link Incorrecto")
    .trim()
    // .exists()
    .notEmpty()
    .custom(async (value) => {
        try {
            if(!value.startsWith('https://')){
                value = 'https://' + value;
            }
            await axios.get(value);
            return value;
        } catch (error) {
            // console.log(error);
            throw new Error ("Not found link 404")
        }
    })
    ,
    validationResultExpress,
]