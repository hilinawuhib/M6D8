import mongoose from "mongoose";
const { Schema, model } = mongoose;
const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
    },

    comment: [
      {
        name: { type: String },
        comment: { type: String },
      },
    ],
  },
  {
    content: { type: String, required: true },
    timestamps: true,
  }
);
export default model("blog", blogSchema);
