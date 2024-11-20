import { Router } from "express";
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import * as authControllers  from "../controllers/auth.js";
import { authLoginSchema, authRegisterSchema, authResetEmailSchema } from "../validation/auth.js";


const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), ctrlWrapper(authControllers.registerController));

authRouter.post('/login', validateBody(authLoginSchema), ctrlWrapper(authControllers.loginController));

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshSessionController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController))

authRouter.post('/send-reset-email', validateBody(authResetEmailSchema), ctrlWrapper(authControllers.requestResetEmailController));

export default authRouter;

