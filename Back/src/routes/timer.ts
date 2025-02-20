import express, { Router } from "express";

import { timerValidators } from "../validator/validator";
import { validate } from "../validator/validate";
import { checkAuth } from "../middleware/check-auth";

const timerRouter: Router = express.Router();

const {
  getTimerRecords,
  createTimerRecord,
  deleteTimerRecord,
} = require("../controllers/timer-controllers");

// 라우트 보호
timerRouter.use(checkAuth);

// 타이머 기록 조회
timerRouter.get(
  "/:email/:date",
  timerValidators.getTimer,
  validate,
  getTimerRecords
);

// 타이머 기록 생성
timerRouter.post(
  "/create",
  timerValidators.createTimer,
  validate,
  createTimerRecord
);

// 타이머 기록 삭제
timerRouter.delete(
  "/delete/:email/:date/:startTime",
  timerValidators.deleteTimer,
  validate,
  deleteTimerRecord
);

export default timerRouter;
