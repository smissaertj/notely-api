import { GraphQLError } from "graphql";

class AuthenticationError extends GraphQLError {
  constructor( message ) {
    super( message );
    this.name = "AuthenticationError";
    this.extensions = { code: "UNAUTHENTICATED" };
  }
}

class ForbiddenError extends GraphQLError {
  constructor( message ) {
    super( message );
    this.name = "ForbiddenError";
    this.extension = { code: "FORBIDDEN" };
  }
}

export { AuthenticationError, ForbiddenError };