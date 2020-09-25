import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { IsArray } from "class-validator";


export class User {
    @ApiProperty()
    @prop()
    name: string;

    @ApiProperty()
    @prop({ required: true })
    email: string;

    @ApiProperty()
    @prop({ required: true })
    password: string;

    @IsArray()
    @prop({ items: String })
    roles: string[] = ['public'];
}