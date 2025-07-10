import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

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
    @MinLength(6)
    newPassword: string;
}
