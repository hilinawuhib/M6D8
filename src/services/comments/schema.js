import mongoose from "mongoose";
const { Schema, model } = mongoose;
const commentSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export default model("comment", commentSchema);