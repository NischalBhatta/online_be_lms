import SessionSchema from "./SessionSchema.js";

//insert new session
export const createNewSession = (userObj) => {
  return SessionSchema(userObj).save();
};
export const deleteSession = (filter) => {
  return SessionSchema.findOneAndDelete(filter);
};
