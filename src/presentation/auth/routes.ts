import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasourceImpl, AuthRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const database = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl(database);

        const controller = new AuthController(authRepository);

        // DEFINIR TODAS MIS RUTAS
        router.post('/login', controller.LoginUser);
        router.post('/register', controller.RegisterUser);
        router.get('/', AuthMiddleware.ValidateJWT, controller.GetUsers);

        return router;
    }
}