import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDTO{

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    username:string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
        message : 'Password must have at least 1 upper case letter, 1 lower case letter, 1 number or special character'
    })
    password:string;
}