module.exports = function sendResetPasswordEmail(ctx, { user }) {
  const { request } = ctx;
  return ctx.sendMail('reset-password', { to: user.email, subject: '[Knitter] Contraseña Actualizada!' }, { user, request });
};
