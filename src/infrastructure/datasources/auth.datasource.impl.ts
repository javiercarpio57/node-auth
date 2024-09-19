import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {

    constructor (
        private readonly HashPassword: HashFunction = BcryptAdapter.Hash,
        private readonly ComparePassword: CompareFunction = BcryptAdapter.Compare
    ) {}

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const { email, password } = loginUserDto;

        try {
            // 1. Verificar si correo existe
            const user = await UserModel.findOne({ email });
            
            if (!user) throw CustomError.BadRequest('User not exists');

            const isMatching = this.ComparePassword(password, user.password);
            if (!isMatching) throw CustomError.BadRequest('Password is not valid');

            // 3. Mapear la respeusta a nuestra entidad
            return UserMapper.UserEntityFormObject(user);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }

            throw CustomError.InternalServer();
        }
    }
    
    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { name, email, password } = registerUserDto;

        try {
            // 1. Verificar si correo existe
            const exist = await UserModel.findOne({ email });
            
            if (exist) throw CustomError.BadRequest('User already exists');

            const user = await UserModel.create({
                name, email, 
                password: this.HashPassword(password)
            });

            // 2. Hash de contraseña
            await user.save();

            // 3. Mapear la respeusta a nuestra entidad
            return UserMapper.UserEntityFormObject(user);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }

            throw CustomError.InternalServer();
        }
    }

}