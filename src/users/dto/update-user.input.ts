/* eslint-disable prettier/prettier */
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(type => Int)
  id: number;
  @Field(type => String, { nullable: true })
  username?: string;
  @Field(type => String, { nullable: true })
  email?: string;
  @Field(type => String, { nullable: true })
  password?: string;
  @Field(type => String, { nullable: true })
  roles?: string;
}
