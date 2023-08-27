import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { User } from 'src/users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from '../types/types';

@Injectable()
export class Auth {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(
      {
        ...payload,
      },
      {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        ...payload,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefershToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id },
      data: { hashedRefershToken },
    });
  }

  async tryLogin(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, email, roles, ...rest } = user;
    const payload: JwtPayload = { id, email, roles };
    const { accessToken, refreshToken } = await this.createTokens(payload);
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }
}
