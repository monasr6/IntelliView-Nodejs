const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject, link) {
    // 1) Render HTML based on a pug template
    const html = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'emails', `${template}.ejs`),
      {
        link,
        name: this.firstName,
      },
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: 'Hello world',
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(link) {
    await this.send('welcome', 'Welcome to the Inteliview Team', link);
  }

  async sendPasswordReset(link) {
    await this.send(
      'resetPassword',
      'Your password reset token (valid for only 10 minutes)',
      link,
    );
  }

  async sendVerifyEmail(link) {
    await this.send(
      'verifyEmail',
      'Your verify email token (valid for only 10 minutes)',
      link,
    );
  }
};
