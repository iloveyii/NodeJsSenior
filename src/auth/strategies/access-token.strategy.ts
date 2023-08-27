import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/types';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    // const f = ExtractJwt.fromAuthHeaderAsBearerToken();
    // const rr = await f(req);
    // const user = this.jwt.decode(rr, {
    // });
    // console.log(rr, user);
    // console.log(payload);
    return payload;
  }
}
