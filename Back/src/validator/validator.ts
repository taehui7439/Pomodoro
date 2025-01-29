import { body, param } from "express-validator";

const notEmptyMessage = (field: string) => `${field}을(를) 입력해야 합니다.`;
const EMAILMESSAGE = "유효한 이메일 주소를 입력해주세요.";
const STARTIMEMESSAGE = "시작 시간은 HH:MM 형식이어야 합니다.";
const ENDTIMEMESSAGE = "종료 시간은 HH:MM 형식이어야 합니다.";
const DURATIONMESSAGE = "지속 시간은 1 이상의 정수여야 합니다.";
const DATEMESSAGE = "날짜는 YYYY-MM-DD 형식이어야 합니다.";
const LENGTHMESSAGE = "6글자 이상이어야 합니다.";

const emailBodyValidator = [
  body("email")
    .isEmail()
    .withMessage(EMAILMESSAGE)
    .notEmpty()
    .withMessage(notEmptyMessage("이메일 주소")),
];

const emailParamValidator = [
  param("email")
    .isEmail()
    .withMessage(EMAILMESSAGE)
    .notEmpty()
    .withMessage(notEmptyMessage("이메일 주소")),
];

export const timerValidators = {
  createTimer: [
    ...emailBodyValidator,

    body("startTime")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage(STARTIMEMESSAGE)
      .notEmpty()
      .withMessage(notEmptyMessage("시작 시간")),

    body("endTime")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage(ENDTIMEMESSAGE)
      .notEmpty()
      .withMessage(notEmptyMessage("종료 시간")),

    body("duration")
      .isInt({ min: 1 })
      .withMessage(DURATIONMESSAGE)
      .notEmpty()
      .withMessage(notEmptyMessage("지속 시간")),
  ],

  getTimer: [...emailParamValidator],

  deleteTimer: [
    ...emailParamValidator,

    param("date")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage(DATEMESSAGE)
      .notEmpty()
      .withMessage(notEmptyMessage("날짜")),

    param("startTime")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage(STARTIMEMESSAGE)
      .notEmpty()
      .withMessage(notEmptyMessage("시작 시간")),
  ],
};

export const userValidators = {
  signup: [
    ...emailBodyValidator,
    body("password")
      .isString()
      .isLength({ min: 6 })
      .withMessage(LENGTHMESSAGE)
      .notEmpty()
      .withMessage(notEmptyMessage("비밀 번호")),
  ],
};
