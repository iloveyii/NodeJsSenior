/* eslint-disable prettier/prettier */
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { isNullableType } from 'graphql';

@ObjectType()
export class UserResponse {
  @Field()
  status: boolean;
  @Field()
  message: string;
  @Field()
  @Field( type => User, { nullable: true })
  user?: User;
  @Field( type => [User], { nullable: true })
  users?: User[];
}
