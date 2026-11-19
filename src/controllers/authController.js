import { responseClient } from "../middleware/responseClient.js";
import {
  createNewSession,
  deleteManySessions,
  deleteSession,
} from "../models/session/SessionModel.js";
import {
  createNewUser,
  getUserByEmail,
  updateUser,
} from "../models/user/UserModel.js";
import {
  userActivationUrlEmail,
  userActivatedNotificationEmail,
  passwordResetOTPEmail,
  passwordUpdatedNotificationEmail,
} from "../services/email/emailService.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { v4 as uuidv4 } from "uuid";
import { getJwts } from "../utils/jwt.js";
import { generateOTP } from "../utils/otp.js";

const OTP_EXPIRY_MS = 15 * 60 * 1000; //15 min

export const insertNewUser = async (req, res, next) => {
  console.log("ROOT_URL =", process.env.ROOT_URL);
  try {
    //to do signup process
    //recieve user data
    // console.log(req.body);
    //encrypt password
    const { password } = req.body;
    req.body.password = hashPassword(password);

    //insert user in db
    const user = await createNewUser(req.body);

    if (user?._id) //create unique activation link and send to their email
    {
      const session = await createNewSession({
        token: uuidv4(),
        association: user.email,
      });
      if (session?._id) {
        const url = `${process.env.ROOT_URL}/activate-user?sessionId=${session._id}&t=${session.token}`;

        //send this url to their email
        console.log(url);
        const emailId = await userActivationUrlEmail({
          email: user.email,
          url,
          name: user.fName,
        });
        if (emailId) {
          const message =
            "We have sent you an email with activation link, please check your email and follow steps to activate your account";
          return responseClient({ req, res, message });
        }
      }
    }
    throw new Error("Unable to create an account,try again later");
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message =
        "The email already exist for another user.Please try another email";
      error.statusCode = 400;
    }
    next(error);
  }
};

export const activateUser = async (req, res, next) => {
  try {
    const { sessionId, t } = req.body;
    console.log(sessionId, t);
    const session = await deleteSession({
      _id: sessionId,
      token: t,
    });
    if (session?._id) {
      //update user to active

      const user = await updateUser(
        { email: session.association },
        { status: "active" },
      );
      if (user?._id) {
        //respond
        userActivatedNotificationEmail({ email: user.email, name: user.fName });

        //send email notification
        const message =
          "Your account has been activated. You may log in your account";
        return responseClient({ req, res, message });
      }
      const message = "Invalid link or token expired!";
      const statusCode = 400;
      return responseClient({ req, res, message, statusCode });
    }
  } catch (error) {
    next(error);
  }
};
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    //get user by email
    const user = await getUserByEmail(email);
    console.log(user);
    if (user?._id) {
      //compare password
      console.log(user._id);
      const isPassMatched = comparePassword(password, user.password);
      if (isPassMatched) {
        console.log("User Authenticated successfully");
        //create jwts
        const jwt = await getJwts(email);

        //response jwts
        return responseClient({
          req,
          res,
          message: "Login Successfull!",
          payload: jwt,
        });
      }
    }

    const message = "Invalid Login Credentials!";
    const statusCode = 400;
    responseClient({ req, res, message, statusCode });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    //get the token
    const { email } = req.userInfo;
    //update refreshJWT to ""
    await updateUser({ email }, { refreshJWT: "" });
    //remove the accessJWT from the sessio table
    await deleteManySessions({ association: email });
    responseClient({ req, res, message: "you are logged out!" });
  } catch (error) {
    next(error);
  }
};

export const requestPassResetOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    if (user?._id && user.status === "active") {
      //remove any previous OTPs so only the latest one works
      await deleteManySessions({ association: email, type: "otp" });

      const otp = generateOTP();
      const session = await createNewSession({
        token: otp,
        association: email,
        type: "otp",
        expire: new Date(Date.now() + OTP_EXPIRY_MS),
      });

      session?._id &&
        (await passwordResetOTPEmail({ email, name: user.fName, otp }));
    } else if (process.env.NODE_ENV !== "production") {
      //server-side only hint; the client still gets the generic message below
      console.log(
        `[DEV] OTP not sent to ${email}: ${user?._id ? `account status is "${user.status}" (must be active)` : "no account with this email"}`,
      );
    }

    //same response whether or not the email exists, so we don't reveal registered emails
    const message =
      "If an account exists for this email, an OTP has been sent. Please check your email.";
    return responseClient({ req, res, message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return responseClient({
        req,
        res,
        message: "Password and confirm password do not match",
        statusCode: 400,
      });
    }

    //find and remove the OTP in one step so it can only be used once
    const session = await deleteSession({
      token: otp,
      association: email,
      type: "otp",
    });

    if (!session?._id) {
      return responseClient({
        req,
        res,
        message: "Invalid or expired OTP",
        statusCode: 400,
      });
    }

    const user = await updateUser(
      { email },
      { password: hashPassword(password), refreshJWT: "" },
    );

    if (user?._id) {
      //log the user out from all devices
      await deleteManySessions({ association: email });

      //don't block the response on the notification email
      passwordUpdatedNotificationEmail({ email, name: user.fName }).catch(
        console.log,
      );

      const message =
        "Your password has been updated. You may now log in with your new password.";
      return responseClient({ req, res, message });
    }

    throw new Error("Unable to update password, please try again later");
  } catch (error) {
    next(error);
  }
};
