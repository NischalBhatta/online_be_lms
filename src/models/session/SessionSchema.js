import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    association: {
      type: String,
    },
    expire: {
      type: Date,
      required: true,
      default: new Date(Date.now() + 36000000), // 1 hour
      expires: 0,
    },
  },
  {
    timestamp: true,
  },
);
export default mongoose.model("Session", SessionSchema);
