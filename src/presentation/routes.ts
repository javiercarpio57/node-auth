import { Router } from "express";
import { AuthRoutes } from "./auth/routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // DEFINIR TODAS MIS RUTAS
        router.use('/api/auth', AuthRoutes.routes);

        return router;
    }
}