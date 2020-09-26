import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService ) {}

    @Post('login')
    async login(@Body() login: LoginDto) {
      return await this.authService.login(login);
    }

    @Post('register')
    async register(@Body() user: RegisterDto) {
      return await this.authService.register(user);
    }
}
