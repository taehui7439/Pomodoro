import { error } from "console";
import express, { Router } from "express";

import { HttpError } from "../models/http-error";

const usersRouter: Router = express.Router();

const { signup, signin } = require("../controllers/users-controllers");

usersRouter.post("/signup/:password/:email", signup);

usersRouter.post("/signin/:password", signin);

export default usersRouter;
