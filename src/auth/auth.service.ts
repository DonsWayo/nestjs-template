import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { User } from 'src/user/model/user.model';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<User|null> {
        const userFromDb = await this.usersService.validateUser(username, password);
        if (userFromDb) {
            return userFromDb;
        }
        return null;
    }

    async login(user: LoginDto) {
        try {
            const userFromDb = await this.usersService.login(user.email, user.password);
            const payload = { email: userFromDb.email, id: userFromDb._id };
            return {
                token: this.jwtService.sign(payload),
                user: userFromDb,
                statusCode: 200
            };
        } catch (error) {
            return error;
        }
    }

    async register(user: RegisterDto) {
        try {
            const userFromDb = await this.usersService.register(user);
            const payload = { email: userFromDb.email, id: userFromDb._id };
            return {
                token: this.jwtService.sign(payload),
                user: userFromDb,
                statusCode: 201
            };
        } catch (error) {
            return error;
        }
    }

}
