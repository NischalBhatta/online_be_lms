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
    // "auth" for activation/access-token sessions, "otp" for password reset OTPs
    type: {
      type: String,
      default: "auth",
    },
    expire: {
      type: Date,
      required: true,
      // function so the default is computed per document, not once at server start
      default: () => new Date(Date.now() + 36000000000),
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("Session", SessionSchema);
