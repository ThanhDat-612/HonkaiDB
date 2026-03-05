import mongoose from "mongoose";
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI");
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  return mongoose.connect(MONGODB_URI);
}