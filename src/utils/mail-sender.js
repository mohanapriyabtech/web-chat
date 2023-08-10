import nodeMailer from 'nodemailer';
import { config } from '../config/index'
import BaseConfig from "../config/base";


// Mail Configuration

class MailConfig extends BaseConfig {

  constructor() {
    super();
  }

  // Email config

  async sendEmail(email, subject, text) {
    const transporter = nodeMailer.createTransport({

      host: config.ENV.SMTP_HOST, // 'smtp.zoho.com',
      secure: true,
      port: config.ENV.SMTP_HOST, // 465,
      auth: {
        user: config.ENV.SMTP_USERNAME,
        pass: config.ENV.SMTP_PASSWORD,
      },

    });


    const mailOptions = {

      from: config.ENV.EMAIL_FROM, // sender address
      to: email,    // receiver address
      subject: subject,
      attachDataUrls: true,
      html: text,
    };

    return new Promise(async (resolve, reject) => {
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err.message)
          resolve(err.message)
        } else {
          resolve('mailSent')
        }

      })
    })

  }

}

export default new MailConfig();




