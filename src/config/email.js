require('dotenv').config();

module.exports = {
  provider: {
    // your provider name directly or from ENV var
    service: process.env.MAILER_SERVICE,
    // auth data always from ENV vars
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  },
  // defaults to be passed to nodemailer's emails
  defaults: {
    from: 'Knitter <knitter.mailer.daemon@knitter.org>',
  },
};
