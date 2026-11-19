import express from "express";

import { userAuthMiddleware } from "../middleware/validation/authMiddleware.js";
import { responseClient } from "../middleware/responseClient.js";
const router = express.Router();

router.get("/profile", userAuthMiddleware, async (req, res) => {
  const user = req.userInfo;
  user.password = undefined;
  user.__v = undefined;
  user.refreshJWT = undefined;
  return responseClient({ req, res, message: "User Profile", payload: user });
});

export default router;
