import mongoose, { Schema } from "mongoose";

const timerSchema = new mongoose.Schema({
  id: { type: Schema.Types.UUID, require: true },
  userId: { type: String, require: true },
  date: { type: String, require: true },
  startTime: { type: String, require: true },
  endTime: { type: String, require: true },
  duration: { type: String, require: true },
});

export const Timer = mongoose.model("Timer", timerSchema);
