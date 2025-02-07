import express, { Router } from "express";

import { userValidators } from "../validator/validator";
import { validate } from "../validator/validate";

const usersRouter: Router = express.Router();

const { signup, signin } = require("../controllers/users-controllers");

usersRouter.post("/signup", userValidators.signup, validate, signup);

usersRouter.post("/signin", userValidators.signup, validate, signin);

export default usersRouter;
