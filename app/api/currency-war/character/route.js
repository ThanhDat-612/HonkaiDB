import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;

    const characters = await db
      .collection("currencyWar")
      .find({})
      .toArray();

    return NextResponse.json(characters);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}