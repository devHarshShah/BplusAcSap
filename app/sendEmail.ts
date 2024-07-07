// utils/sendEmail.js
const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig');

const transporter = nodemailer.createTransport(emailConfig);

const sendRejectionEmail = async (reason : string, dateRange: string, receiver: string) => {
  const mailOptions = {
    from: '"BplusAc Pvt Ltd" <noreply@bplusac.com>', // sender address
    to: receiver, // receiver
    subject: 'Timesheet Rejected', // Subject line
    text: `Dear User,\n\nYour timesheet for the period ${dateRange} has been rejected due to the following reason:\n${reason}\n\nBest regards,\nThe Admin Team`, // plain text body
    html: `<p>Dear User,</p><p>Your timesheet for the period <strong>${dateRange}</strong> has been rejected due to the following reason:</p><p>${reason}</p><p>Best regards,<br>The Admin Team</p>`, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error occurred', error);
  }
};

export default sendRejectionEmail;