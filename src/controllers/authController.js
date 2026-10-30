import { responseClient } from "../middleware/responseClient.js";
import {
  createNewSession,
  deleteSession,
} from "../models/session/SessionModel.js";
import { createNewUser, updateUser } from "../models/user/UserModel.js";
import {
  userActivationUrlEmail,
  userActivatedNotificationEmail,
} from "../services/email/emailService.js";
import { hashPassword } from "../utils/bcrypt.js";
import { v4 as uuidv4 } from "uuid";

export const insertNewUser = async (req, res, next) => {
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
      return responseClient({ req, res, message, statusCoder });
    }
  } catch (error) {
    next(error);
  }
};
