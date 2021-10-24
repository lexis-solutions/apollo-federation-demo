import {
  Directive,
  Field,
  FieldResolver,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

const orders = [
  {
    id: "062e5a2d-6fb4-45ea-b928-f069a5a38240",
    cost: 100,
    ownerId: "749ada2c-d348-45c5-ac21-64a018b24b82",
  },
];

@ObjectType()
@Directive("@extends")
@Directive('@key(fields: "id")')
export class User {
  @Field()
  @Directive("@external")
  id: string;

  @Field(() => [Order])
  orders: Order[];
}

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  cost: number;

  @Field()
  owner: User;
}

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => [Order])
  orders(@Root() { id }: User) {
    return orders.filter((row) => row.ownerId === id);
  }
}

@Resolver()
export class OrdersResolver {
  @Query(() => String)
  foo() {
    return "This query only exists because the GraphQL schema needs to have at least 1 query to be able to compile.";
  }
}
