import { Request, Response, NextFunction } from "express";
import { HttpError } from "../models/http-error";
import { config } from "dotenv";

import { validate } from "../validator/validate";
import { Timer } from "../models/timerSchema";

// 타이머 기록 타입 정의
interface TimerRecord {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

// 사용자의 타이머 기록 조회
const getTimerRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;

  try {
    // 데이터 조회
    const userRecords = await Timer.find({ userId: email }).exec();

    if (!userRecords.length) {
      return next(new HttpError("타이머 기록을 찾을 수 없습니다.", 404));
    }

    res.json({ records: userRecords });
  } catch (err) {
    return next(new HttpError("타이머 기록 조회에 실패했습니다.", 500));
  }
};

// 새로운 타이머 기록 생성
const createTimerRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, startTime, endTime, duration } = req.body;

  // 요청 데이터 검증
  if (!email || !startTime || !endTime || duration === undefined) {
    return next(new HttpError("필수 데이터가 누락되었습니다.", 400));
  }

  const newRecord = new Timer({
    userId: email,
    date: new Date().toISOString().split("T")[0],
    startTime,
    endTime,
    duration,
  });

  try {
    // 데이터를 DB에 저장
    const result = await newRecord.save();

    res.status(201).json({
      message: `${email}님의 타이머 기록이 저장되었습니다.`,
      record: newRecord,
    });
  } catch (err) {
    return next(new HttpError("타이머 기록 생성 실패", 500));
  }
};

// 타이머 기록 삭제
const deleteTimerRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, date, startTime } = req.params;

  try {
    const result = await Timer.deleteOne({
      userId: email,
      date: date,
      startTime: startTime,
    });

    res.status(201).json({
      message: `${email}님의 ${date} ${startTime} 타이머 기록이 삭제되었습니다.`,
      record: result,
    });
  } catch (err) {
    return next(new HttpError("타이머 기록 삭제 실패", 500));
  }
};

export { getTimerRecords, createTimerRecord, deleteTimerRecord };
