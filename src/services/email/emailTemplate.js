export const userActivationUrlEmailTemplate = ({ email, name, url }) => {
  const obj = {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`, // sender address
    to: email, // list of recipients
    subject: "Action Required: Activate Your New Account", // subject line
    text: `Hello ${name}, Please Follow the Link to Activate Your Account ${url}`, // plain text body
    html: `
    <p>
    Hello ${name}
</p>
<br />
<br />
<p>Your Account has been created. Please follow the link to activate your account</p>
<br />
<br />
<a href=${url}>
 <button style = "background:green;color:white; padding: 2rem; ">Activate Now</button></a>
    `, // HTML body
  };

  return obj;
};
export const userAccountActivatedNotificationTemplate = ({ email, name }) => {
  const obj = {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`, // sender address
    to: email, // list of recipients
    subject: "Action Required: Activate Your New Account", // subject line
    text: `Hello ${name}, Your account has been activated. You may log in your account `, // plain text body
    html: `
    <p>
    Hello ${name}
</p>
<br />
<br />
<p>Your account has been activated. You may log in your account</p>
<br />
<br />

    `, // HTML body
  };

  return obj;
};

export const passwordResetOTPTemplate = ({ email, name, otp }) => {
  const obj = {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your Password Reset OTP",
    text: `Hello ${name}, Your password reset OTP is ${otp}. It expires in 15 minutes. If you did not request this, please ignore this email.`,
    html: `
<p>Hello ${name}</p>
<br />
<p>Use the OTP below to reset your password. It expires in 15 minutes.</p>
<h2 style="letter-spacing: 0.3rem;">${otp}</h2>
<br />
<p>If you did not request a password reset, please ignore this email.</p>
    `,
  };

  return obj;
};

export const passwordUpdatedNotificationTemplate = ({ email, name }) => {
  const obj = {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your Password Has Been Updated",
    text: `Hello ${name}, Your password has been updated. If this wasn't you, please contact us immediately.`,
    html: `
<p>Hello ${name}</p>
<br />
<p>Your password has been updated. You may now log in with your new password.</p>
<p>If this wasn't you, please contact us immediately.</p>
    `,
  };

  return obj;
};
