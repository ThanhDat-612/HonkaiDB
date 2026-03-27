import mongoose from "mongoose";
 
const RelicSchema = new mongoose.Schema({
  _id:    { type: String },                          // "Champion of Streetwise Boxing"
  id:     { type: String, required: true },          // "championofstreetwiseboxing"
  name:   { en: String, vi: String },
  type:   { type: String, enum: ["cavern", "planar"], required: true },
  rarity: { type: Number, enum: [2, 4], required: true }, // 4 = cavern, 2 = planar
  "2-piece": { en: String, vi: String },
  "4-piece":  { en: String, vi: String },            // chỉ có nếu type = cavern
}, { _id: false });
 
export default mongoose.models.Relic ||
  mongoose.model("Relic", RelicSchema, "relics");
 