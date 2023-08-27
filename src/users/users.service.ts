import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { SignUpInput } from 'src/auth/dto/signup-input';
import { Prisma } from '@prisma/client';
import { DBHelper } from './helpers/db-helper';
import { ActivateUser } from './helpers/activate-user';
import { ActivePayload } from './types/active-user.payload';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private authService: AuthService,
    private activateUser: ActivateUser,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const signUpInput: SignUpInput = createUserInput;
      const loginUserResponse = await this.authService.signUp(signUpInput);
      return loginUserResponse?.user;
    } catch (e: any) {
      console.log(e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(DBHelper.getErrorMessage(e.code));
      }
      throw new BadRequestException(e.message);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (e: any) {
      console.log(e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(DBHelper.getErrorMessage(e.code));
      }
      throw new BadRequestException('Some error occurred');
    }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found with id: ' + id);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, email, roles, ...rest } = user;
    return {
      id,
      username,
      email,
      roles,
    };
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserInput,
        },
      })
      .catch((e: any) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            throw new BadRequestException('User not found with id: ' + id);
          }
        }
        throw new BadRequestException('Some error occurred');
      });
    return user;
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
        where: { id },
      })
      .catch((e: any) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            throw new BadRequestException('User not found with id: ' + id);
          }
        }
        throw new BadRequestException('Some error occurred');
      });
  }

  async getActivationCode(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      return false;
    }
    return this.activateUser.getHashString(user);
  }

  async activateAccount(code: string) {
    // if user is already activated
    const valid = this.activateUser.isValid(code);
    if (valid) {
      const payload: ActivePayload =
        this.activateUser.getPayloadFromHashString(code);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });
      if (user.active == true) {
        console.log('User is already active');
        return 'User is already activated';
      }
      // activate user
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const activatedUser = await this.prisma.user.update({
        where: { id: payload.id },
        data: {
          active: true,
        },
      });
      console.log('User with email ' + user.email + ' is activated now!');
      return 'User with email ' + user.email + ' is activated now!';
      // console.log(activatedUser, code, user);
    } else {
      console.log('code exp');
      return 'The activation code is expired!';
    }
  }
}
