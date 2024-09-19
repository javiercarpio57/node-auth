import { JWTAdapter } from "../../../config";
import { RegisterUserDto } from "../../dtos/auth/register-user.dto";
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

interface RegisterUserUseCase {
    Execute (registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class RegisterUser implements RegisterUserUseCase {

    constructor (
        private readonly authRepositroy: AuthRepository,
        private readonly signToken: SignToken = JWTAdapter.GenerateToken,
    ) { }
    
    async Execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
        
        const user = await this.authRepositroy.register(registerUserDto);

        const token = await this.signToken({ email: user.email }, '2h');
        if (!token) throw CustomError.InternalServer('Error generating token');

        return {
            token,
            user: { id: user.id, name: user.name, email: user.email }
        }
    }

}

