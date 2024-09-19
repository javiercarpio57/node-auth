import { Request, Response } from "express"
import { AuthRepository, CustomError, LoginUserDto, LoginUser, RegisterUser, RegisterUserDto } from "../../domain";
import { JWTAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthController {
    constructor (
        private readonly authRepository: AuthRepository,
    ) { }

    private HandleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.status_code).json({ error: error.message });
        }

        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    RegisterUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.Create(req.body);
        if (error) return res.status(400).json({ error });

        new RegisterUser(this.authRepository)
            .Execute(registerUserDto!)
            .then(data => res.json(data))
            .catch(err => this.HandleError(err, res));
    }

    LoginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.Login(req.body);
        if (error) return res.status(400).json({ error });

        new LoginUser(this.authRepository)
            .Execute(loginUserDto!)
            .then(data => res.json(data))
            .catch(err => this.HandleError(err, res));
    }

    GetUsers = (req: Request, res: Response) => {
        UserModel.find()
            .then(users => {
                res.json({ users })
            })
            .catch(() => res.status(500).json({ error: 'Internal Server Error' }));
    }
}