import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Headers,
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

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30s',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
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
  
    const access_token = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1hr',
    });
  
    const refresh_token = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  
    return {
      access_token,
      refresh_token,
      userId: user._id,
      userRole: user.role,
    };
  }
  

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  
  @Post('refresh')
  async refresh(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token missing from header');
    }
  
    const refreshToken = authHeader.replace('Bearer ', '').trim();
  
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      // console.log("payload to the back end",payload)  

      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, role: payload.role },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '30s',
        },
      );
  
      console.log("successfully send the refresh token back to the front end",newAccessToken)
      return {
        access_token: newAccessToken,
        userId: payload.sub,
        userRole: payload.role,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
