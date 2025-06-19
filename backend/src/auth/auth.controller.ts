import { Controller, Post, Body, UnauthorizedException, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UserLoginDto } from './dto/userLoginDto';
import { JwtService } from '@nestjs/jwt';

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
  
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

}
