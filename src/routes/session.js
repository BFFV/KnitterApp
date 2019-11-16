const KoaRouter = require('koa-router');
const crypto = require('crypto');

const router = new KoaRouter();

const sendForgotPasswordEmail = require('../mailers/forgot-password');
const sendResetPasswordEmail = require('../mailers/reset-password');

// Starts the session & upgrades the user's role when certain conditions are met
async function login(ctx, next) {
  const status = await next();
  const { user } = ctx.state;
  if (status === 'logged') {
    if (user.role === 'common') {
      const { popular } = await ctx.orm.user.findOne({
        raw: true,
        attributes: [[ctx.orm.sequelize.fn('COUNT', ctx.orm.sequelize.col('username')), 'popular']],
      });
      const { relevant } = await ctx.orm.pattern.findOne({
        raw: true,
        where: {
          authorId: user.id,
        },
        attributes: [[ctx.orm.sequelize.fn('AVG', ctx.orm.sequelize.col('popularity')), 'relevant']],
      });
      const { qualified } = await ctx.orm.pattern.findOne({
        raw: true,
        where: {
          authorId: user.id,
        },
        attributes: [[ctx.orm.sequelize.fn('AVG', ctx.orm.sequelize.col('score')), 'qualified']],
      });
      if ((user.popularity >= popular * 0.2) && (relevant >= popular * 0.1) && (qualified >= 4)) {
        await user.update({ role: 'top' });
      }
    }
    ctx.redirect('/');
  }
  return 'Session Start';
}

router.get('session.new', '/new', (ctx) => ctx.render('session/new', {
  createSessionPath: ctx.router.url('session.create'),
  newUserPath: ctx.router.url('users.new'),
  forgotPasswordPath: ctx.router.url('session.forgot'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.create', '/', login, async (ctx) => {
  const { email, password } = ctx.request.body;
  let error = 'Email o contraseña incorrectos!';
  try {
    const user = await ctx.orm.user.findOne({ where: { email } });
    const isPasswordCorrect = user && await user.checkPassword(password);
    if (isPasswordCorrect) {
      ctx.state.user = user;
      ctx.session.token = user.token;
      return 'logged';
    }
  } catch (e) {
    error = 'Parámetros NO válidos!';
  }
  return ctx.render('session/new', {
    email,
    createSessionPath: ctx.router.url('session.create'),
    forgotPasswordPath: ctx.router.url('session.forgot'),
    newUserPath: ctx.router.url('users.new'),
    error,
  });
});

router.get('session.forgot', '/forgot', (ctx) => ctx.render('session/forgot', {
  sendMailPath: ctx.router.url('session.forgot'),
  sessionPath: ctx.router.url('session.new'),
}));

router.post('session.forgot', '/forgot', async (ctx) => {
  const { email } = ctx.request.body;
  let error = 'No existe ninguna cuenta con ese correo!';
  try {
    const user = await ctx.orm.user.findOne({ where: { email } });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = Date.now() + 3600000;
      await user.update({ resetToken, resetTokenExpires });
      await sendForgotPasswordEmail(ctx, { user });
      error = `Se ha enviado un email a ${email} con las instrucciones para recuperar la cuenta!`;
    }
  } catch (e) {
    error = 'Parámetros NO válidos!';
  }
  return ctx.render('session/forgot', {
    sendMailPath: ctx.router.url('session.forgot'),
    sessionPath: ctx.router.url('session.new'),
    error,
  });
});

router.get('session.reset', '/reset/:token', async (ctx) => {
  const user = await ctx.orm.user.findOne(
    {
      where: {
        resetToken: ctx.params.token,
        resetTokenExpires: { [ctx.orm.Sequelize.Op.gt]: Date.now() },
      },
    },
  );
  if (!user) {
    return ctx.redirect(ctx.router.url('session.new'));
  }
  return ctx.render('session/reset', {
    resetPasswordPath: ctx.router.url('session.reset', { token: ctx.params.token }),
    sessionPath: ctx.router.url('session.new'),
  });
});

router.post('session.reset', '/reset/:token', async (ctx) => {
  const user = await ctx.orm.user.findOne(
    {
      where: {
        resetToken: ctx.params.token,
        resetTokenExpires: { [ctx.orm.Sequelize.Op.gt]: Date.now() },
      },
    },
  );
  if (!user) {
    ctx.redirect(ctx.router.url('session.new'));
  }
  const { password, confirmPass } = ctx.request.body;
  if (password === confirmPass) {
    try {
      await user.update({ password });
    } catch (validationError) {
      const { errors } = validationError;
      let error = 'Parámetros NO válidos!';
      if (errors) {
        error = errors[0].message;
      }
      return ctx.render('session/reset', {
        resetPasswordPath: ctx.router.url('session.reset', { token: ctx.params.token }),
        sessionPath: ctx.router.url('session.new'),
        error,
      });
    }
    const resetToken = undefined;
    const resetTokenExpires = undefined;
    await user.update({ resetToken, resetTokenExpires });
    await sendResetPasswordEmail(ctx, { user });
    return ctx.redirect(ctx.router.url('session.new'));
  }
  return ctx.render('session/reset', {
    resetPasswordPath: ctx.router.url('session.reset', { token: ctx.params.token }),
    sessionPath: ctx.router.url('session.new'),
    error: 'Las contraseñas deben coincidir!',
  });
});

router.delete('session.destroy', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('session.new'));
});

module.exports = router;
