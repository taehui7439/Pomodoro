import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "이메일은 필수 입력값입니다."],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "비밀번호는 필수 입력값입니다."],
    minlength: [6, "비밀번호는 최소 6자 이상이어야 합니다."],
  },
});

// 이메일 중복 체크를 위한 인덱스 생성
userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
