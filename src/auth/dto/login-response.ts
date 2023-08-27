import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class LoginResponse {
  @IsNotEmpty()
  @IsString()
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
