import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './model/user.model';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';

const saltRounds = 10;

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
    ) { }

    async findById(id: string): Promise<User> {
        return await this.userModel.findOne({ _id: id }).exec();
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email: email }).exec();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async getCount(): Promise<number> {
        return await this.userModel.count({}).exec();
    }

    async login(email: string, password: string) {
        const userFromDb = await this.userModel.findOne({ email: email });
        console.log(userFromDb)
        if (!userFromDb) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        if (!userFromDb.email) throw new HttpException('EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);

        const isValidPass = await bcrypt.compare(password, userFromDb.password);
        if (isValidPass) {
            return userFromDb;
        } else {
            throw new HttpException('INVALID_PASSWORD', HttpStatus.UNAUTHORIZED);
        }

    }

    async register(newUser: RegisterDto) {
        const userRegistered = await this.findByEmail(newUser.email);
        if (!userRegistered) {
            newUser.password = await bcrypt.hash(newUser.password, saltRounds);
            const createdUser = new this.userModel(newUser);
            createdUser.roles = ["user"];
            return await createdUser.save();
        } else {
            throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
        }

    }

    async validateUser(username: string, pass: string): Promise<User> {
        const user = await this.userModel.findOne({ username });

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(pass, user.password);

        if (valid) {
            return user;
        }

        return null;
    }
}
