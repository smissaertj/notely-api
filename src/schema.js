import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { gql } from "graphql-tag";
import { GraphQLDateTime } from "graphql-scalars";
import { AuthenticationError, ForbiddenError } from "./customErrors.js";
import { Note } from "./models/note.js";
import { User } from "./models/user.js";


// Construct a schema using GraphQL Schema Language
export const typeDefs = gql`
  "Custom Scalar type since GraphQL doesn't come with a date type"
  scalar DateTime
  
  type Query {
    "Fetch all Notes."
    notes: [Note!]!
    "Fetch a specific Note by ID."
    note(id: ID!): Note
  }

  type Mutation {
    "Add a new Note."
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    "Allows a user to signup, returns a JWT"
    signUp(username: String!, email: String!, password: String!): String!
    "Allows a user to sign in with either a username or an email and a password, returns a JWT"
    signIn(username: String, email: String, password: String!): String!
  }

  type Note {
    "The Note's ID."
    id: ID!
    "The Note content."
    content: String!
    "The Note author."
    author: String!
    "The date and time a note was created."
    createdAt: DateTime!
    "The date and time a note was updated."
    updatedAt: DateTime!
  }
  
  type User {
    id: ID!
    username: String!
    email: String!
    "A link/url pointing to the user's avatar."
    avatar: String
    "An array of notes the user created."
    notes: [Note!]!
  }
`;

// Provide resolver functions for our Schema fields
export const resolvers = {
  Query: {
    // Return an array of notes to populate the client applications
    notes: async () => {
      return await Note.find();
    },
    // Return a specific note by ID
    note: async ( parent, args ) => {
      return await Note.findById( args.id );
    },
  },
  Mutation: {
    // Add a new note and returns the note
    newNote: async ( parent, args ) => {
      return await Note.create( {
        content: args.content,
        author: "Joeri Smissaert", 
      } );
    },
    // Deletes a note by ID
    deleteNote: async ( parent, { id } ) => {
      try {
        await Note.findOneAndRemove( { _id: id } );
        return true;
      } catch ( err ) {
        return false;
      }
    },
    updateNote: async ( parent, { content, id } ) => {
      try {
        return await Note.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: {
              content
            }
          },
          {
            new: true // Instruct the DB to return the updated note
          }
        );
      } catch ( err ) {
        console.error( err );
      }

    },
    signUp: async ( parent, { username, email, password } ) => {
      // normalize email address
      email = email.trim().toLowerCase();
      // hash the password
      const hashedPw = await bcrypt.hash( password, 10 );
      try {
        const user = await User.create( {
          username,
          email,
          password: hashedPw
        } );
        // create and return the JWT
        return jwt.sign( { id: user._id }, process.env.JWT_SECRET );
      } catch( err ) {
        console.error( err );
        throw new Error( `Error creating account: ${err.message}` );
      }
    },
    signIn: async( parent, { username, email, password } ) => {
      if ( email ){
        // normalize email address
        email = email.trim().toLowerCase();
      }

      const user = await User.findOne( {
        $or: [ { email }, { username } ]
      } );

      // if no user is found, throw an auth error
      if ( !user ){
        throw new AuthenticationError( "Error signing in!" );
      }

      // if the passwords don't match, throw an auth error
      const isValidPassword = await bcrypt.compare( password, user.password );
      if ( !isValidPassword ){
        throw new AuthenticationError( "Error signing in!" );
      }

      // create and return the json web token
      return jwt.sign( { id: user._id }, process.env.JWT_SECRET );
    }
  },
  DateTime: GraphQLDateTime
};
