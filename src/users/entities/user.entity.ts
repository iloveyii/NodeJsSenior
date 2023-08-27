/* eslint-disable prettier/prettier */
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserResponse } from '../dto';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'The ID field (placeholder)' })
  id: number;
  @Field()
  username: string;
  @Field()
  email: string;
  @Field( type => String, { nullable: true })
  roles?: string;
  @Field( type => Boolean, { nullable: true })
  active?: boolean;

  static getResponse(
    status: boolean,
    message: string,
    user?: User,
    users?: User[],
  ): UserResponse {
    const response: UserResponse = {
      status,
      message,
      user,
      users,
    };
    return response;
  }
}
