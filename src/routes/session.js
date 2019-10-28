const KoaRouter = require('koa-router');
const crypto = require('crypto')

const router = new KoaRouter();

// const sendForgotPasswordEmail = require('../mailers/forgot-password');

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
  rootPath: '/',
  notice: ctx.flashMessage.notice,
}
));

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
    rootPath: '/',
    error,
  });
});

router.get('session.forgot', '/forgot', (ctx) => ctx.render('session/forgot', {
  newUserPath: ctx.router.url('users.new'),
  sendMailPath: ctx.router.url('session.recover'),
  rootPath: '/',
  notice: ctx.flashMessage.notice,
}));

router.put('session.recover', '/', async (ctx) => {
  const { email } = ctx.request.body;

  let error = 'No existe cuenta con ese correo!';
  try{
    const user = await ctx.orm.user.findOne({ where: { email } });
    if (user) {
      // user.resetToken = user.resetToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await sendForgotPasswordEmail(ctx, { email });
      return ctx.redirect('/')
    }
    else {
      return ctx.render('session/new', {
        createSessionPath: ctx.router.url('session.create'),
        forgotPasswordPath: ctx.router.url('session.forgot'),
        newUserPath: ctx.router.url('users.new'),
        rootPath: '/',
        error,
      });
    }
  }
   catch (e) {
    error = 'Parámetros NO válidos!';
  }
  return ctx.render('session/new', {
    createSessionPath: ctx.router.url('session.create'),
    forgotPasswordPath: ctx.router.url('session.forgot'),
    newUserPath: ctx.router.url('users.new'),
    rootPath: '/',
    error,
  });
});

router.delete('session.destroy', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('session.new'));
});

module.exports = router;
