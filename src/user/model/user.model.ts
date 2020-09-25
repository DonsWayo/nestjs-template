import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";


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
}