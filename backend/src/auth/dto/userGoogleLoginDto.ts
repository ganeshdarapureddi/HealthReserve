import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserGoogleLoginDto{
    @ApiProperty()
    @IsString()
    token:string
}