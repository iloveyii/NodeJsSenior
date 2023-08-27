import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { Auth } from './entities/auth.entity';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    PrismaService,
    ConfigService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    Auth,
  ],
})
export class AuthModule {}
