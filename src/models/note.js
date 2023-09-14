import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  // Assigns createdAt and updatedAt fields with a Date type
  {
    timestamps: true,
  },
);

export const Note = mongoose.model( "Note", noteSchema );
