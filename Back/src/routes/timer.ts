import express, { Router } from "express";

const timerRouter: Router = express.Router();

const {
  getTimerRecords,
  createTimerRecord,
  deleteTimerRecord,
} = require("../controllers/timer-controllers");

timerRouter.get("/:email", getTimerRecords);
timerRouter.post("/create", createTimerRecord);
timerRouter.delete("/delete", deleteTimerRecord);

export default timerRouter;
