import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userData?: {
        userId: string; // userId의 타입 정의
      };
    }
  }
}
