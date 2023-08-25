// Construct a schema using GraphQL Schema Language
export const typeDefs = `#graphql
  type Query{
    hello: String
  }
`

// Provide resolver functions for our Schema fields
export const resolvers = {
  Query: {
    hello: () => 'Hello World!'
  }
}