import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema({
  name: String,
  element: String,
  path: String,
  rarity: Number,
  image: String,
  description: String
});

export default mongoose.models.Character ||
  mongoose.model("Character", CharacterSchema, "character");