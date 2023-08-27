import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput, UserResponse } from './dto';

@UseGuards(RolesGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Mutation(() => UserResponse, { name: 'create_user' })
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserResponse> {
    try {
      const user = await this.usersService.create(createUserInput);
      return await User.getResponse(true, 'User created !', user);
    } catch (e: any) {
      return User.getResponse(false, e.message);
    }
  }

  @Roles(['admin', 'user'])
  @Query(() => UserResponse, { name: 'get_users' })
  async readAll(): Promise<UserResponse> {
    try {
      const users = await this.usersService.findAll();
      return await User.getResponse(true, 'All users !', null, users);
    } catch (e: any) {
      return User.getResponse(false, e.message);
    }
  }

  @Roles(['admin', 'user'])
  @Query(() => UserResponse, { name: 'get_user' })
  async readUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserResponse> {
    try {
      const user = await this.usersService.findOne(id);
      return User.getResponse(true, 'User fetched!', user);
    } catch (e: any) {
      return User.getResponse(false, e.message);
    }
  }

  @Roles(['admin'])
  @Mutation(() => UserResponse, { name: 'update_user' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<UserResponse> {
    try {
      const user = await this.usersService.update(
        updateUserInput.id,
        updateUserInput,
      );
      return User.getResponse(true, 'Updated user!', user);
    } catch (e: any) {
      return User.getResponse(false, e.message);
    }
  }

  @Roles(['admin'])
  @Mutation(() => UserResponse, { name: 'delete_user' })
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserResponse> {
    try {
      const user = await this.usersService.remove(id);
      return User.getResponse(true, 'Deleted user!', user);
    } catch(e: any) {
      return User.getResponse(false, e.message);
    }
  }

  @Roles(['admin'])
  @Mutation(() => UserResponse, { name: 'get_activation_code' })
  async getActivationCodeForUserId(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserResponse> {
    try {
      const hash = await this.usersService.getActivationCode(id);
      return User.getResponse(true, 'activation_code: ' + hash);
    } catch(e: any) {
      return User.getResponse(false, e.message);
    }
  }

  @Public()
  @Mutation(() => UserResponse, { name: 'activate_user_account' })
  async activateUserAccount(
    @Args('code', { type: () => String }) code: string,
  ): Promise<UserResponse> {
    try {
      const message = await this.usersService.activateAccount(code);
      return User.getResponse(true, message);
    } catch(e: any) {
      return User.getResponse(false, e.message);
    }
  }
}
