const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const Transport = require('nodemailer-brevo-transport');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Natours Server <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendinBlue
      return nodemailer.createTransport(
        new Transport({ apiKey: process.env.SENDBLUE_APIKEY })
      );
    }
    // This line code not worked then i use the (nodemailer-brevo-transport) package****
    // return nodemailer.createTransport({
    //   service: 'Brevo',
    //   host: process.env.SENDBLUE_HOST,
    //   port: process.env.SENDBLUE_PORT,
    //   auth: {
    //     user: process.env.SENDBLUE_USERNAME,
    //     pass: process.env.SENDBLUE_PASSWORD,
    //   },
    // });

    // ***** Use MailTrap ****
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send actual email
  async send(template, subject) {
    // 1) Render HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject: subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome tho the Natours familly');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minute)'
    );
  }
};
