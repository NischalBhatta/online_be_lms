import {
  userActivationUrlEmailTemplate,
  userAccountActivatedNotificationTemplate,
  passwordResetOTPTemplate,
  passwordUpdatedNotificationTemplate,
} from "./emailTemplate.js";
import { sendMail } from "./transport.js";

export const userActivationUrlEmail = async (obj) => {
  const id = await sendMail(userActivationUrlEmailTemplate(obj));
  console.log(id);
  return id;
};

export const userActivatedNotificationEmail = async (obj) => {
  const id = await sendMail(userAccountActivatedNotificationTemplate(obj));
  console.log(id);
  return id;
};

export const passwordResetOTPEmail = async (obj) => {
  const id = await sendMail(passwordResetOTPTemplate(obj));
  console.log(id);
  return id;
};

export const passwordUpdatedNotificationEmail = async (obj) => {
  const id = await sendMail(passwordUpdatedNotificationTemplate(obj));
  console.log(id);
  return id;
};
