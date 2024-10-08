import nodemailer from 'nodemailer';
import config from '../../config';

// user: 'azmalgazi8@gmail.com',
// pass: 'ewth rkny utvh mysj',

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 465,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'azmalgazi8@gmail.com',
      pass: 'ewth rkny utvh mysj',
    },
  });

  const mailData = {
    from: {
      name: 'Plate Pal',
      address: 'azmalgazi8@gmail.com' as string,
    },

    to,
    subject: 'Reset your password within ten minutes!',
    text: '',
    html,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        // console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
