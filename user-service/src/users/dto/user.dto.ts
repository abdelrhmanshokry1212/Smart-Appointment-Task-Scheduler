
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    profilePhotoUrl?: string;

    @IsString()
    @IsOptional()
    jobTitle?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    bio?: string;
}

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    profilePhotoUrl?: string;

    @IsString()
    @IsOptional()
    jobTitle?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    bio?: string;
}

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
