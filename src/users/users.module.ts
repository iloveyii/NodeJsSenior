import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from 'src/auth/strategies/refresh-token.strategy';
import { ConfigService } from '@nestjs/config';
import { Auth } from 'src/auth/entities/auth.entity';
import { ActivateUser } from './helpers/activate-user';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    AuthService,
    JwtService,
    PrismaService,
    ConfigService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    Auth,
    ActivateUser,
  ],
})
export class UsersModule {}
