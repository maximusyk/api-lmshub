import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/users.dto';
import { AuthGoogleTokenDto, AuthTokensDto, SigninLocalDto } from './dto/auth.dto';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayload } from './strategies/refresh-token.strategy';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { JwtAccessPayload } from './strategies/access-token.strategy';
import { AuthAccess, AuthRefresh } from './decorators/auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) { }

    @ApiOperation({ summary: 'Login with google' })
    @Post('/google')
    async authenticateGoogle(@Body() tokenData: AuthGoogleTokenDto, @Req() request: Request) {
        const tokens = await this.authService.authenticateGoogle(tokenData.accessToken);
        const expiresDate = Date.now() + eval(this.configService.get('JWT_REFRESH_TOKEN_LIFETIME'));
        request.res.cookie(
            'refreshToken',
            tokens.refreshToken,
            { httpOnly: true, expires: new Date(expiresDate) }
        );
        return { accessToken: tokens.accessToken };
    }

    @ApiOperation({ summary: 'Basic sign up' })
    @ApiResponse(
        {
            status: 200,
            type: AuthTokensDto,
            description: 'User successfully registered and signed in'
        }
    )
    @Post('/local/signup')
    async signupLocal(@Body() signupData: CreateUserDto) {
        const { accessToken } = await this.authService.signupLocal(signupData);
        return { accessToken };
    }

    @ApiOperation({ summary: 'Basic sign in' })
    @ApiResponse(
        {
            status: 200,
            type: AuthTokensDto,
            description: 'User successfully signed in'
        }
    )
    @Post('/local/signin')
    async signinLocal(@Body() signinData: SigninLocalDto, @Res({ passthrough: true }) response: Response) {
        console.log(signinData);
        const tokens = await this.authService.signinLocal(signinData);
        const expiresDate = Date.now() + eval(this.configService.get('JWT_REFRESH_TOKEN_LIFETIME'));
        response.cookie(
            'refreshToken',
            tokens.refreshToken,
            { httpOnly: true, expires: new Date(expiresDate) }
        );
        return { accessToken: tokens.accessToken };
    }

    @ApiOperation({ summary: 'Logout' })
    @ApiResponse(
        {
            status: 200,
            description: 'User successfully logged out'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Post('/logout')
    async logout(@GetCurrentUser() user: JwtAccessPayload, @Res({ passthrough: true }) response: Response): Promise<void> {
        await this.authService.logout(user.sub);
        response.clearCookie('refreshToken');
    }

    @ApiOperation({ summary: 'Generate new tokens' })
    @ApiResponse(
        {
            status: 200,
            type: AuthTokensDto,
            description: 'User tokens successfully refreshed'
        }
    )
    @ApiBearerAuth()
    @AuthRefresh()
    @Post('/refresh')
    async refreshTokens(@GetCurrentUser() user: JwtRefreshPayload, @Res({ passthrough: true }) response: Response) {
        const tokens = await this.authService.refreshTokens(user.sub, user.refreshToken);
        const expiresDate = Date.now() + eval(this.configService.get('JWT_REFRESH_TOKEN_LIFETIME'));
        response.cookie(
            'refreshToken',
            tokens.refreshToken,
            { httpOnly: true, expires: new Date(expiresDate) }
        );
        return { accessToken: tokens.accessToken };
    }
}

