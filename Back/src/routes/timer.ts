import express, { Router } from "express";

import { timerValidators } from "../validator/validator";
import { validate } from "../validator/validate";

const timerRouter: Router = express.Router();

const {
  getTimerRecords,
  createTimerRecord,
  deleteTimerRecord,
} = require("../controllers/timer-controllers");

timerRouter.get("/:email", timerValidators.getTimer, getTimerRecords);
timerRouter.post(
  "/create",
  timerValidators.createTimer,
  validate,
  createTimerRecord
);
timerRouter.delete("/delete", timerValidators.deleteTimer, deleteTimerRecord);

export default timerRouter;
