import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDTO } from './dto/auth.credentials.dto';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    public async signup(authCredentials: AuthCredentialsDTO): Promise<void> {
        const { password } = authCredentials;

        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        authCredentials.password = hashedPass;

        try {
            await this.userRepository.createUser(authCredentials);
        }
        catch (message) {
            if (message.code === '23505') {
                this.conflictExceptionMethod('Username already in use');
            }
            else {
                this.internalServerErrorMethod();
            }
        }
    }

    public async signin(authCredentials: AuthCredentialsDTO): Promise<object> {
        const { username, password } = authCredentials;
        const user = await this.userRepository.getOneUser(username);
        const matchPass = await bcrypt.compare(password, user.password);

        if (user && matchPass) {
            const payload: JwtPayload = { username };
            const token: string = await this.jwtService.sign(payload);

            return {
                message: 'success',
                accessToken: token,
            };
        }
        else {
            this.unauthorizedExceptionMethod('Please check login credentials');
        }

    }

    private conflictExceptionMethod(message) {
        throw new ConflictException(message);
    }

    private internalServerErrorMethod() {
        throw new InternalServerErrorException();
    }

    private unauthorizedExceptionMethod(message) {
        throw new UnauthorizedException(message);
    }
}
