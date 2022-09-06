import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/users.dto';
import { AuthTokensDto, SigninLocalDto } from './dto/auth.dto';
import { RoleEnum } from '../roles/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../tokens/tokens.service';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { generatePassword } from 'src/utils/password-generator.util';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    oAuthClient: Auth.OAuth2Client;
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly tokensService: TokensService,
        private readonly configService: ConfigService,
        private readonly rolesService: RolesService
    ) {
        const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
        const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

        this.oAuthClient = new google.auth.OAuth2(clientID, clientSecret);
    }

    hashData(data: string) {
        try {
            return bcrypt.hash(data, 10);
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async getGoogleUserData(googleToken: string) {
        try {
            const userInfoClient = google.oauth2('v2').userinfo;

            this.oAuthClient.setCredentials({
                access_token: googleToken
            })

            const userInfoResponse = await userInfoClient.get({
                auth: this.oAuthClient
            });

            return userInfoResponse.data;
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async authenticateGoogle(googleToken: string): Promise<AuthTokensDto> {
        try {
            const tokenInfo = await this.oAuthClient.getTokenInfo(googleToken);

            const email = tokenInfo.email;

            const user = await this.usersService.findByLogin(email);

            return this.signinLocal({ email, password: user.password });
        } catch (error) {
            if (error?.status !== 404) {
                throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
            }

        }
    }

    async signupGoogle(googleToken: string) {
        try {
            const userInfo = await this.getGoogleUserData(googleToken);
            const studentRole = await this.rolesService.findByTitle(RoleEnum.STUDENT);
            const userPassword = generatePassword();
            const userCreateDto: CreateUserDto = {
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                username: `${userInfo.given_name.toLowerCase()}.${userInfo.family_name.toLowerCase()}`,
                email: userInfo.email,
                password: userPassword,
                roleId: studentRole.id
            }

            const user = await this.usersService.create(userCreateDto);

            const signedTokens = await this.signTokens(user.id, user.email, user.role.title);

            await this.tokensService.createOrUpdate(user.id, await this.hashData(signedTokens.refreshToken));

            return signedTokens;
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async signTokens(userId: string, email: string, role: RoleEnum): Promise<AuthTokensDto> {
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(
                    { sub: userId, email, role },
                    { secret: process.env.JWT_SECRET_ACCESS_KEY, expiresIn: eval(this.configService.get('JWT_ACCESS_TOKEN_LIFETIME')) },
                ),
                this.jwtService.signAsync(
                    { sub: userId, email, role },
                    { secret: process.env.JWT_SECRET_REFRESH_KEY, expiresIn: eval(this.configService.get('JWT_REFRESH_TOKEN_LIFETIME')) },
                ),
            ]);

            return { accessToken, refreshToken };
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async signupLocal(signupData: CreateUserDto): Promise<AuthTokensDto> {
        try {
            const hashedPassword = await this.hashData(signupData?.password);

            const user = await this.usersService.create({ ...signupData, hashedPassword });

            const signedTokens = await this.signTokens(user.id, user.email, user.role.title);

            await this.tokensService.createOrUpdate(user.id, await this.hashData(signedTokens.refreshToken));

            return signedTokens;
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async signinLocal(signinData: SigninLocalDto): Promise<AuthTokensDto> {
        try {
            const user = await this.usersService.findByLogin(signinData.email);
            if (!user) throw new HttpException('User with this email does not exist!', HttpStatus.BAD_REQUEST);

            const isPasswordMatches = await bcrypt.compare(signinData.password, user.password);
            if (!isPasswordMatches) throw new HttpException('Password is incorrect!', HttpStatus.BAD_REQUEST);

            const signedTokens = await this.signTokens(user.id, user.email, user.role.title);

            await this.tokensService.createOrUpdate(user.id, await this.hashData(signedTokens.refreshToken));

            return signedTokens;
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async logout(userId: string): Promise<void> {
        try {
            await this.tokensService.removeByUser(userId);
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async refreshTokens(userId: string, refreshToken: string) {
        try {
            const token = await this.tokensService.findOne(userId);
            if (!token) throw new HttpException('User token not found!', HttpStatus.BAD_REQUEST);

            const isRefreshTokenMatches = await bcrypt.compare(refreshToken, token.refreshToken);
            if (!isRefreshTokenMatches) throw new HttpException(
                'Refresh token is incorrect!',
                HttpStatus.BAD_REQUEST,
            );

            const signedTokens = await this.signTokens(token.user.id, token.user.email, token.user.role.title);

            await this.tokensService.createOrUpdate(token.user.id, await this.hashData(signedTokens.refreshToken));

            return signedTokens;
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }
}
