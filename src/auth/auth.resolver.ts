import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { UseGuards } from '@nestjs/common';
import {
  SignUpInput,
  LoginResponse,
  LoginInput,
  LogoutResponse,
  RefreshTokenResponse,
} from './dto';
import { Public, CurrentUser, CurrentUserId } from './decorators';
import { RefreshTokenGuard, RolesGuard } from './guards';

@Resolver(() => Auth)
@UseGuards(RolesGuard)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse, { name: 'signup' })
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Public()
  @Mutation(() => LoginResponse, { name: 'login' })
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Public()
  @Mutation(() => LogoutResponse, { name: 'logout' })
  logout(@Args('id', { type: () => Int }) id: number) {
    return this.authService.logout(id);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => RefreshTokenResponse, { name: 'getNewTokens' })
  getNewTokens(
    @CurrentUserId() id: string,
    @CurrentUser() refreshToken: string,
  ) {
    return this.authService.getNewTokens(Number(id), refreshToken);
  }
}
