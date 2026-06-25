import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { verifyPassword } from 'src/user/utils/password.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ){}

    async logIn(logInDto: LoginDto) {
        const user = await this.userService.findByEmailForAuth(logInDto.email)

        if ( !user ) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User account is inactive.');
        }

        const isPasswordValid = await verifyPassword(
            user.passwordHash,
            logInDto.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            tokenRype: 'Bearer',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePhotoUrl: user.profilePhotoUrl,
            }
        }

    }
}
