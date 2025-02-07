import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { HttpError } from "../src/models/http-error";
import { connectDB } from "../src/config/database";

import usersRouter from "../src/routes/users";
import timerRouter from "../src/routes/timer";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// 미들웨어 설정
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors 설정
app.use(
  cors({
    origin: "*", // 출처 허용
    credentials: true, // 사용자 인증이 필요한 리소스
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/users", usersRouter);
app.use("/timer", timerRouter);

// 라우트 찾을 수 없음 에러 처리
app.use((req, res, next) => {
  const error = new HttpError("라우트를 찾을 수 없습니다.", 404);
  throw error;
});

// 표준 오류 처리
app.use((error: any, req: any, res: any, next: any) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "알 수 없는 오류" });
});

// 서버 시작 전 DB 연결
connectDB().then(() => {
  console.log(`⚡️[서버]: 서버가 실행중입니다`);
});

export default app;
