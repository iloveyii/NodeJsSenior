import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { SignUpInput, LoginInput } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private auth: Auth,
  ) {}

  async signUp(signUpInput: SignUpInput) {
    const { password, ...result } = signUpInput;
    const hashedPassword = await argon.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...result,
          hashedPassword,
        },
      });
      return await this.auth.tryLogin(user);
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Unique constraint violation');
        }
      }
      throw new BadRequestException('Some error occurred');
    }
  }

  async login(loginInput: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });
    if (!user) {
      throw new NotFoundException();
    }
    if (user.active !== true) {
      throw new ForbiddenException('User is not Active');
    }
    const valid = await argon.verify(user.hashedPassword, loginInput.password);
    if (!valid) {
      throw new ForbiddenException();
    }
    return this.auth.tryLogin(user);
  }

  async logout(id: number) {
    await this.prisma.user.updateMany({
      where: {
        id,
        hashedRefershToken: { not: null },
      },
      data: { hashedRefershToken: null },
    });
    return { logOut: true };
  }

  async getNewTokens(id: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied!');
    }
    const validMatch = await argon.verify(
      user.hashedRefershToken,
      refreshToken,
    );
    if (!validMatch) {
      throw new ForbiddenException('Access Denied!');
    }
    return this.auth.tryLogin(user);
  }
}
