import express from "express";
import { createNewUser } from "../models/user/userModel";
import { insertNewUser } from "../controllers/authController";

const router = express.Router();

//User Signup

router.post("/register", insertNewUser);

export default router;
