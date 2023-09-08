import { gql } from 'graphql-tag';
import { Note } from './models/note.js';

// Mock data
let notes = [
  { id: '1', content: 'Note 1', author: 'Joeri' },
  { id: '2', content: 'Note 2', author: 'Dave' },
  { id: '3', content: 'Note 3', author: 'Mike' },
  { id: '4', content: 'Note 4', author: 'Steve' },
];

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
    note(parent, args, contextValue, info) {
      return notes.find((note) => note.id === args.id);
    },
  },
  Mutation: {
    // Add a new note and returns the note
    newNote(parent, args, contextValue, info) {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'Joeri',
      };
      notes.push(noteValue);
      return noteValue;
    },
  },
};
