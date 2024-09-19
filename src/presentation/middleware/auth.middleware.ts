import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthMiddleware {

    static ValidateJWT = async (req: Request, res: Response, next: NextFunction) => {
        
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'No token provided' });
        if (!authorization.startsWith('Bearer')) return res.status(401).json({ error: 'Invalidad Bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JWTAdapter.ValidateToken<{ email: string }>(token);
            if (!payload) return res.status(401).json({ error: 'No token provided' });

            const user = await UserModel.findOne({ email: payload.email });
            if (!user) return res.status(401).json({ error: 'Invalid token - user not foud' });
            
            req.body.user = user;

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}

