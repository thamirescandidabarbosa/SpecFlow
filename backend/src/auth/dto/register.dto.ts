import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '../password-policy';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
    password: string;
}
