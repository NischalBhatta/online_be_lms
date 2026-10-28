import {
  userActivationUrlEmailTemplate,
  userAccountActivatedNotificationTemplate,
} from "./emailTemplate.js";
import { emailTransporter } from "./transport.js";

export const userActivationUrlEmail = async (obj) => {
  //get the transporter

  //get the template
  const transport = emailTransporter();

  const info = await transport.sendMail(userActivationUrlEmailTemplate(obj));
  console.log(info.messageId);
  return info.messageId;
};
export const userActivatedNotificationEmail = async (obj) => {
  //get the transporter

  //get the template
  const transport = emailTransporter();

  const info = await transport.sendMail(
    userAccountActivatedNotificationTemplate(obj),
  );
  console.log(info.messageId);
  return info.messageId;
};
