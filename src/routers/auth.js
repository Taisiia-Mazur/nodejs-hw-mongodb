import { Router } from "express";
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import * as authControllers  from "../controllers/auth.js";
import { authLoginSchema, authRegisterSchema, authResetEmailSchema, loginWithGoogleOAuthSchema, resetPasswordSchema } from "../validation/auth.js";


const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), ctrlWrapper(authControllers.registerController));

authRouter.post('/login', validateBody(authLoginSchema), ctrlWrapper(authControllers.loginController));

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshSessionController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController))

authRouter.post('/send-reset-email', validateBody(authResetEmailSchema), ctrlWrapper(authControllers.requestResetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(authControllers.resetPasswordController));

authRouter.get('/get-oauth-url', ctrlWrapper(authControllers.getGoogleOAuthUrlController));

authRouter.post('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema), ctrlWrapper(authControllers.loginWithGoogleController));

export default authRouter;

