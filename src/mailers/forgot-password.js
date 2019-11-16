module.exports = function sendForgotPasswordEmail(ctx, { user }) {
  const { request } = ctx;
  return ctx.sendMail('forgot-password', { to: user.email, subject: '[Knitter] Restablecer Contraseña' }, { user, request });
};
