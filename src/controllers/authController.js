import { createNewUser } from "../models/user/userModel.js";
import { hashPassword } from "../utils/bcrypt.js";

export const insertNewUser = async (req, res, next) => {
  try {
    //to do signup process
    //recieve user data
    console.log(req.body);
    //encrypt password
    const { password } = req.body;
    req.body.password = hashPassword(password);

    //insert user in db
    const user = await createNewUser(req.body);

    //create unique activation link and send to their email
    id(user?._id);
    {
      res.json({
        status: "success",
        message: "TODO Signup",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
