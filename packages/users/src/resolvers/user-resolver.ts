import { Directive, Field, ObjectType, Query, Resolver } from "type-graphql";

const users = [
  {
    id: "749ada2c-d348-45c5-ac21-64a018b24b82",
  },
];

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field()
  id: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  me() {
    return users[0];
  }
}
