import { getSession } from "../../models/session/SessionModel.js";
import { getOneUser, getUserByEmail } from "../../models/user/userModel.js";
import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../../utils/jwt.js";
import { responseClient } from "../responseClient.js";

export const userAuthMiddleware = async (req, res, next) => {
  //get accessJWT
  const { authorization } = req.headers;
  let message = "Unauthorized";
  console.log(authorization);
  if (authorization && authorization.startsWith("bearer ")) {
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
          req.userInfo = user;
          return next();
        }
      }
    }
    message = decoded === "jwt expired" ? decoded : "Unauthorized";
  }
  responseClient({ req, res, message: "Unauthorized", statusCode: 400 });
};

export const renewAccessJWTMiddleware = async (req, res, next) => {
  //get accessJWT
  const { authorization } = req.headers;
  let message = "Unauthorized";
  console.log(authorization);
  if (authorization && authorization.startsWith("bearer ")) {
    const token = authorization.split(" ")[1];

    //check if valid or not
    const decoded = verifyRefreshJWT(token);
    console.log("decoded:", decoded);
    const byEmail = await getOneUser({ email: decoded.email });
    console.log(
      "user by email:",
      byEmail?.email,
      "stored refreshJWT:",
      byEmail?.refreshJWT,
    );
    if (decoded?.email) {
      const user = await getOneUser({
        email: decoded.email,
        refreshJWT: token,
      });
      //check if exist in session tables
      if (user?._id) {
        //create new accessJWT
        const token = await createAccessJWT(decoded.email);
        //return accessJWT
        return responseClient({
          req,
          res,
          message: "Here is the accessJWT",
          payload: token,
        });
      }
    }
  }
  responseClient({ req, res, message: "Unauthorized", statusCode: 400 });
};
