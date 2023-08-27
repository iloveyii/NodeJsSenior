import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ActivePayload } from '../types/active-user.payload';

@Injectable()
export class ActivateUser {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public getHashString(user: User): string {
    const payload: ActivePayload = {
      id: user.id,
    };
    const accessToken = this.jwtService.sign(
      {
        ...payload,
      },
      {
        expiresIn: '48h',
        secret: this.configService.get('ACTIVATE_TOKEN_SECRET'),
      },
    );
    return accessToken;
  }

  public getPayloadFromHashString(hash: string): ActivePayload {
    const payload: ActivePayload = <ActivePayload>this.jwtService.decode(hash);
    return payload;
  }

  public isValid(hash: string) {
    try {
      const o = this.jwtService.verify(hash, {
        secret: this.configService.get('ACTIVATE_TOKEN_SECRET'),
      });
      console.log('V: ', o);
      return true;
    } catch (e: any) {
      console.log('V: invalid');
      return false;
    }
  }
}
