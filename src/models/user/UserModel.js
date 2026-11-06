import UserSchema from "./UserSchema.js";

//insert new user
export const createNewUser = (userObj) => {
  return UserSchema(userObj).save();
};
export const updateUser = (filter, update) => {
  return UserSchema.findOneAndUpdate(filter, update, { new: true });
};
export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};
