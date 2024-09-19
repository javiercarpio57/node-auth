import { JWTAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";

interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface LoginUserUseCase {
    Execute (loginUserDto: LoginUserDto): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {

    constructor (
        private readonly authRepositroy: AuthRepository,
        private readonly signToken: SignToken = JWTAdapter.GenerateToken,
    ) { }
    
    async Execute(loginUserDto: LoginUserDto): Promise<UserToken> {
        const user = await this.authRepositroy.login(loginUserDto);

        const token = await this.signToken({ email: user.email }, '2h');
        if (!token) throw CustomError.InternalServer('Error generating token');

        return {
            token,
            user: { id: user.id, name: user.name, email: user.email }
        }
    }

}

