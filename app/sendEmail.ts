// utils/sendEmail.js
const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig');

const transporter = nodemailer.createTransport(emailConfig);

const sendCustomEmail = async (
  receiver: string,
  subject: string,
  text: string,
  html: string
) => {
  const mailOptions = {
    from: '"BplusAc Pvt Ltd" <noreply@bplusac.com>', // sender address
    to: receiver, // receiver
    subject: subject, // Subject line dynamically provided
    text: text, // plain text body dynamically provided
    html: html, // html body dynamically provided
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    //console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error occurred', error);
  }
};

export default sendCustomEmail;