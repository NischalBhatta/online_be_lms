import { randomInt } from "crypto";

// 6-digit numeric OTP (100000-999999, so no leading zeros)
export const generateOTP = () => String(randomInt(100000, 1000000));
