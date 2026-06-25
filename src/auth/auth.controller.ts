import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import type { AuthenticatedUser } from './strategies/jwt.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (
        private readonly authServices: AuthService
    ){}

    @Post()
    @ApiOperation({
        summary: 'User Log In',
        description: 'Verify email and password to log in.',
    })
    @ApiOkResponse({
        description: 'User authenticated successfully.',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid credentials or inactive account.',
    })
    logIn(@Body() logInDto: LoginDto) {
        return this.authServices.logIn(logInDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get authenticated user',
        description: 'Returns the user data stored in the JWT payload.',
    })
    @ApiOkResponse({
        description: 'Authenticated user returned successfully.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    getMe(@CurrentUser() user: AuthenticatedUser ) {
        return user
    }

}
