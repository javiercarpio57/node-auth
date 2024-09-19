import { AuthDatasource, AuthRepository, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";


export class AuthRepositoryImpl implements AuthRepository {
    
    constructor (
        private readonly datasource: AuthDatasource
    ) {}

    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.datasource.register(registerUserDto);
    }

    login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.datasource.login(loginUserDto);
    }

}