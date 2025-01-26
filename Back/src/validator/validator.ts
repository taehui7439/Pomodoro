import { body, param } from "express-validator";

const notEmptyMessage = (field: string) => `${field}을(를) 입력해야 합니다.`;

export const timerValidators = {
  createTimer: [
    body("email")
      .isEmail()
      .withMessage("유효한 이메일 주소를 입력해주세요.")
      .notEmpty()
      .withMessage(notEmptyMessage("이메일 주소")),

    body("startTime")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("시작 시간은 HH:MM 형식이어야 합니다.")
      .notEmpty()
      .withMessage(notEmptyMessage("시작 시간")),

    body("endTime")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("종료 시간은 HH:MM 형식이어야 합니다.")
      .notEmpty()
      .withMessage(notEmptyMessage("종료 시간")),

    body("duration")
      .isInt({ min: 1 })
      .withMessage("지속 시간은 1 이상의 정수여야 합니다.")
      .notEmpty()
      .withMessage(notEmptyMessage("지속 시간")),
  ],

  getTimer: [
    param("email")
      .isEmail()
      .withMessage("유효한 이메일 주소를 입력해주세요.")
      .notEmpty()
      .withMessage(notEmptyMessage("이메일 주소")),
  ],

  deleteTimer: [
    param("email")
      .isEmail()
      .withMessage("유효한 이메일 주소를 입력해주세요.")
      .notEmpty()
      .withMessage(notEmptyMessage("이메일 주소")),

    param("date")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("날짜는 YYYY-MM-DD 형식이어야 합니다.")
      .notEmpty()
      .withMessage(notEmptyMessage("날짜")),
  ],
};
