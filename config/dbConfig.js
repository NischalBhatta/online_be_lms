import mongoose from "mongoose";

export const dbConnect = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("PLease Provide MONGO_URL database connection string");
  }
  return mongoose.connect(process.env.MONGO_URL);
};
