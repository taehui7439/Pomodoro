import { HttpError } from "../models/http-error";
import { v4 as uuid } from "uuid";

import { validate } from "../validator/validate";

const DUMMY_USER = [
  {
    id: uuid(),
    password: "1",
    email: "1@gmail.com",
  },
];

// 회원가입
const signup = (req: any, res: any, next: any) => {
  // 입력 확인 함수
  // validate(req, res, next);

  const { password, email } = req.params;

  const newUser = {
    id: uuid(),
    password: password,
    email: email,
  };

  const userExists = DUMMY_USER.some((user) => user.email === newUser.email);

  if (userExists) {
    return next(new HttpError("이미 존재하는 이메일입니다.", 400));
  }

  DUMMY_USER.push(newUser);

  res.status(201).json({ message: newUser.email + "님 회원가입 완료" });
};

// 로그인
const signin = (req: any, res: any, next: any) => {
  const user = DUMMY_USER.find(
    (user) =>
      user.password === req.body.password && user.email === req.body.email
  );

  if (!user) {
    return next(new HttpError("사용자를 찾을 수 없습니다.", 404));
  }

  res.status(200).json({ message: user.email + "님 로그인 완료" });
};

export { signup, signin };
