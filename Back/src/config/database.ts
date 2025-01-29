import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URL;

if (!url) {
  throw new Error("MongoDB URL이 설정되지 않았습니다.");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB 연결 성공");
  } catch (error) {
    console.error("MongoDB 연결 실패:", error);
    process.exit(1);
  }
};
