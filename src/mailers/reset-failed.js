module.exports = function sendResetFailedEmail(ctx, { user }) {
  const { request } = ctx;
  return ctx.sendMail('reset-failed', { to: user.email, subject: '[Knitter] No se pudo restablecer la contraseña' }, { user, request });
};
