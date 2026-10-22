export const userActivationUrlEmailTemplate = ({ email, name, url }) => {
  const obj = {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`, // sender address
    to: email, // list of recipients
    subject: "Action Required: Activate Your New Account", // subject line
    text: `Hello ${name}, Please Follow the Link to Activate Your Account`, // plain text body
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
