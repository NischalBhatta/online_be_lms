import express from "express";

import {
  activateUser,
  insertNewUser,
  loginUser,
} from "../controllers/authController.js";
import {
  loginDataValidation,
  newUserDataValidation,
  userActivationDataValidation,
} from "../middleware/validation/authDataValidation.js";

const router = express.Router();

//User Signup

router.post("/register", newUserDataValidation, insertNewUser);
router.post("/activate-user", userActivationDataValidation, activateUser);

//User Login
router.post("/login", loginDataValidation, loginUser);

export default router;
