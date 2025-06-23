import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UserLoginDto } from './dto/userLoginDto';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UserGoogleLoginDto } from './dto/userGoogleLoginDto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    const user = await this.userService.findByEmailAndPassword(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user._id, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      userId: user._id,
      userRole: user.role,
    };
  }

  @Post('google-login')
  async googleLogin(@Body() userGoogleLoginDto: UserGoogleLoginDto) {
    const { token } = userGoogleLoginDto;

    let payload: any;

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const { email, name, phone } = payload;

    console.log(email, name, phone);

    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.create({
        name,
        email,
        password: null,
        phone,
        provider: 'google',
      });
    }

    const jwtPayload = { sub: user._id, role: user.role };
    const access_token = await this.jwtService.signAsync(jwtPayload);

    return {
      access_token,
      userId: user._id,
      userRole: user.role,
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
