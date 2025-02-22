import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UsersRepository } from "./users.repository";
import { JwtPayload } from "./jwt-payload.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userRepository: UsersRepository,
        private configService:ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload):Promise<User>{
        const { username } = payload;

        const user:User = await this.userRepository.getOneUser(username);

        if(!user){
          this.unauthorizedExceptionMethod();
        }
        return user;
    }

    private unauthorizedExceptionMethod(){
        throw new UnauthorizedException();
    }
}