import { gql } from "graphql-tag";
import { Note } from "./models/note.js";

// Construct a schema using GraphQL Schema Language
export const typeDefs = gql`
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
  }

  type Note {
    "The Note's ID."
    id: ID!
    "The Note content."
    content: String!
    "The Note author."
    author: String!
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
    }
  },
};
