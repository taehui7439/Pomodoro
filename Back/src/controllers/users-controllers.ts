import { HttpError } from "../models/http-error";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { validate } from "../validator/validate";
import { User } from "../models/userSchema";

// 사용자 기록 타입 정의
interface UserRecord {
  userId: string;
  passWord: string;
}

// 회원가입
const signup = async (req: any, res: any, next: any) => {
  const { password, email } = req.body;

  try {
    // 이메일 중복 확인
    const existingUser = await User.findOne({ userId: email });

    if (existingUser) {
      return next(new HttpError("이미 가입된 이메일입니다.", 422));
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 12);

    // 사용자 생성
    const newUser = new User({
      userId: email,
      password: hashedPassword,
    });

    // DB에 저장
    const result = await newUser.save();

    // 5. JWT 토큰 생성
    const token = jwt.sign(
      { userId: newUser.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: `${email} 님 회원가입을 환영합니다.`,
      userId: newUser.userId,
      token,
    });
  } catch (err) {
    return next(new HttpError("회원가입 실패", 500));
  }
};

// 로그인
const signin = async (req: any, res: any, next: any) => {
  const { password, email } = req.body;

  try {
    // 이메일로 사용자 찾기
    const existingUser = await User.findOne({
      userId: email,
    });

    if (!existingUser) {
      return next(new HttpError("회원을 찾지 못했습니다.", 404));
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return next(
        new HttpError("이메일 또는 비밀번호가 올바르지 않습니다.", 401)
      );
    }

    // 3. JWT 토큰 생성
    const token = jwt.sign(
      { userId: existingUser.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({
      message: "로그인 성공",
      userId: existingUser.userId,
      token,
    });
  } catch (err) {
    return next(new HttpError("로그인 실패.", 500));
  }
};

export { signup, signin };
