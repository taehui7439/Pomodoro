import { HttpError } from "../models/http-error";
import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  // 옵션 요청 통과
  if (req.method === "OPTION") {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("토큰 인증 실패");
    }

    // 토큰 인증
    const decodedToken = verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // 요청 데이터에 추가
    // req.userData = { userId: decodedToken.userId };
    // 다음 요청 진행
    next();
  } catch (err) {
    const error = new HttpError("토큰 인증 실패", 401);
    return next(error);
  }
};
