/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field( type => String, { nullable: true })
  roles?: string;
  @Field( type => Boolean, { nullable: true })
  active?: boolean;
}
