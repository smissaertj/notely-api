import { gql } from 'graphql-tag';
import { Note } from './models/note.js';

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
    note: async (parent, args, contextValue, info) => {
      return await Note.findById(args.id);
    },
  },
  Mutation: {
    // Add a new note and returns the note
    newNote: async (parent, args, contextValue, info) => {
      return await Note.create({
        content: args.content,
        author: 'Joeri Smissaert',
      });
    },
  },
};
