import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AuthTokensDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}

export class AuthGoogleTokenDto {
    @ApiProperty()
    accessToken: string;
}

export class SigninLocalDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;
}

export class LogoutDto {
    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    userId: string;
}