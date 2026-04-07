import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '../password-policy';

export class ResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
    newPassword: string;
}
