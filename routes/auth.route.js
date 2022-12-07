import {Router} from "express";
import {
    login,
    register,
    infoUser,
    refreshToken,
    logout,
} from "../controllers/auth.controller.js";
import { validateToken } from "../middlewares/validateToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import {
    loginValidator,
    registerValidator,
    tokenCookieValidator,
    tokenHeaderValidator,
} from "../middlewares/validatorManager.js";

const router = Router();

router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login);

router.get("/protected",  validateToken, infoUser);
router.get("/refresh", tokenCookieValidator, requireRefreshToken, refreshToken);

router.get("/logout", logout);

export default router;