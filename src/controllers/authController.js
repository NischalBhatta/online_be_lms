import { createNewUser } from "../models/user/userModel.js";
import { hashPassword } from "../utils/bcrypt.js";

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
      res.json({
        status: "success",
        message: "TODO Signup",
      });
    }
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message =
        "The email already exist for another user.Please try another email";
      error.statusCode = 200;
    }
    next(error);
  }
};
