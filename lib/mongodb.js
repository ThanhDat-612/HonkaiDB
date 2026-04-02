import mongoose from "mongoose";

// Cấu hình DNS nếu môi trường của bạn gặp vấn đề về phân giải tên miền Atlas
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Vui lòng định nghĩa MONGODB_URI trong file .env.local");
}

/** * Sử dụng biến global để duy trì kết nối khi Next.js hot-reload ở môi trường dev.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Tắt hàng đợi lệnh nếu chưa kết nối để dễ debug lỗi
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("=> Đã kết nối MongoDB thành công");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}