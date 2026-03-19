import mongoose from "mongoose";

const LightConeSchema = new mongoose.Schema({
  _id: String,         // vd: "yaoguang"
  id: String,          // vd: "5_0001"
  name: {
    en: String,
    vi: String,
  },
  rarity: Number,      // 4 hoặc 5
  path: String,        // vd: "Elation", "Hunt", ...
  stat: {
    hp:  Number,
    atk: Number,
    def: Number,
  },
  description: {
    en: String,
    vi: String,
  },
}, { _id: false });    // dùng _id tự định nghĩa (string)

export default mongoose.models.LightCone
  || mongoose.model("LightCone", LightConeSchema, "lightcone");