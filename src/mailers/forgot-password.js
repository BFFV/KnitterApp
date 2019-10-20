module.exports = function sendForgotPasswordEmail(ctx, { email }) {
  return ctx.sendMail('forgot-password', { to: email, subject: '[Knitter] Password Recovery' }, { email });
};