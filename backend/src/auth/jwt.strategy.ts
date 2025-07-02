import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role };
  }
}

//here this validate is getting the request along with token and the payload with that token is placed in the request object here
//which JWT auth guard is triggering the request object with the payload and passed to all the routes in controller