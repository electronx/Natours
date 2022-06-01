const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'ae006996f50787',
      pass: 'b576d277fd4b6a',
    },
  });

  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //     tls: {
  //       rejectUnauthorized: false,
  //     },
  //   });
  //     // activate in gmail "less secure app" option, use Sandrgrid or Mailgun
  // 2) define the email options

  const mailOptions = {
    from: 'The Escapist <zura@zura.zura',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  // 3) actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
