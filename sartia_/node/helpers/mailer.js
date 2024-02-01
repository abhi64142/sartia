const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendGrid = function (from, to, subject, html) {
  sgMail
    .send({
      from,
      to,
      subject,
      text: "verify email.",
      html,
    })
    .then((response) => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};
