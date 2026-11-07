import express from "express";
import { responseClient } from "../middleware/responseClient.js";
import { verifyAccessJWT } from "../utils/jwt.js";
import { getSession } from "../models/session/SessionModel.js";
import { getUserByEmail } from "../models/user/userModel.js";
const router = express.Router();

router.get("/profile", async (req, res) => {
  //get accessJWT
  const { authorization } = req.headers;
  let message = "Unauthorized";
  console.log(authorization);
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];

    //check if valid or not
    const decoded = verifyAccessJWT(token);
    console.log(decoded);
    if (decoded.email) {
      const tokenSession = await getSession({ token });
      //check if exist in session tables
      if (tokenSession._id) {
        //get the user by email
        const user = await getUserByEmail(decoded.email);
        if (user?.id && user.status === "active") {
          //return the user
          responseClient({ req, res, message: "User Profile", payload: user });
        }
      }
    }
    return (message = decoded === "jwt expired" ? decoded : "Unauthorized");
  }
  responseClient({ req, res, message: "Unauthorized", statusCode: 400 });
});

export default router;
