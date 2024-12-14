import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth.credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private authSercvice: AuthService) { }

    @Post('/signup')
    public signup(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        return this.authSercvice.signup(authCredentialsDTO);
    }

    @Post('/signin')
    public signin(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<object> {
        return this.authSercvice.signin(authCredentialsDTO);
    }
}
