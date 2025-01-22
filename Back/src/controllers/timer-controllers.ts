import { Request, Response, NextFunction } from "express";
import { HttpError } from "../models/http-error";
import { v4 as uuid } from "uuid";

// 타이머 기록 타입 정의
interface TimerRecord {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

// 임시 데이터 저장소
let DUMMY_TIMER_RECORDS: TimerRecord[] = [
  {
    id: uuid(),
    userId: "1@gmail.com",
    date: "2025-01-22",
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
  },
];

// 사용자의 타이머 기록 조회
const getTimerRecords = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;

  try {
    const userRecords = DUMMY_TIMER_RECORDS.filter(
      (record) => record.userId === email
    );

    if (!userRecords.length) {
      return next(new HttpError("타이머 기록을 찾을 수 없습니다.", 404));
    }

    res.json({ records: userRecords });
  } catch (err) {
    return next(new HttpError("타이머 기록 조회에 실패했습니다.", 500));
  }
};

// 새로운 타이머 기록 생성
const createTimerRecord = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const newRecord: TimerRecord = {
    id: uuid(),
    userId: email,
    date: new Date().toISOString().split("T")[0],
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    duration: req.body.duration,
  };

  res.status(201).json({
    message: `${email}님의 타이머 기록이 저장되었습니다.`,
    record: newRecord,
  });
};

// 타이머 기록 삭제
const deleteTimerRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, date } = req.params;

  try {
    const recordExists = DUMMY_TIMER_RECORDS.some(
      (record) => record.userId === email && record.date === date
    );

    if (!recordExists) {
      return next(
        new HttpError("해당 날짜의 타이머 기록을 찾을 수 없습니다.", 404)
      );
    }

    DUMMY_TIMER_RECORDS = DUMMY_TIMER_RECORDS.filter(
      (record) => !(record.userId === email && record.date === date)
    );

    res.status(200).json({
      message: `${email}님의 ${date} 타이머 기록이 삭제되었습니다.`,
    });
  } catch (err) {
    return next(new HttpError("타이머 기록 삭제에 실패했습니다.", 500));
  }
};

export { getTimerRecords, createTimerRecord, deleteTimerRecord };
