import { IsString, IsEmail, IsOptional, Matches, MinLength } from 'class-validator';
import { PASSWORD_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '../../auth/password-policy';

export class UpdateUserProfileDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}

export class ChangePasswordDto {
    @IsString()
    currentPassword: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
    newPassword: string;
}
