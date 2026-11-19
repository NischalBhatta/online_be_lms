import express from "express";

import {
  activateUser,
  insertNewUser,
  loginUser,
  logoutUser,
  requestPassResetOTP,
  resetPassword,
} from "../controllers/authController.js";
import {
  loginDataValidation,
  newUserDataValidation,
  otpRequestDataValidation,
  resetPasswordDataValidation,
  userActivationDataValidation,
} from "../middleware/validation/authDataValidation.js";
import {
  renewAccessJWTMiddleware,
  userAuthMiddleware,
} from "../middleware/validation/authMiddleware.js";

const router = express.Router();

//User Signup

router.post("/register", newUserDataValidation, insertNewUser);
router.post("/activate-user", userActivationDataValidation, activateUser);

//User Login
router.post("/login", loginDataValidation, loginUser);
router.get("/renew-jwt", renewAccessJWTMiddleware);

//User Logout
router.post("/logout", userAuthMiddleware, logoutUser);

//Forgot Password
router.post("/otp", otpRequestDataValidation, requestPassResetOTP);
router.post("/reset-password", resetPasswordDataValidation, resetPassword);

export default router;
