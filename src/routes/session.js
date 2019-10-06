const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('session.new', '/new', (ctx) => ctx.render('session/new', {
  createSessionPath: ctx.router.url('session.create'),
  newUserPath: ctx.router.url('users.new'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.create', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  let error = 'Email o contraseña incorrectos!';
  try {
    const user = await ctx.orm.user.findOne({ where: { email } });
    const isPasswordCorrect = user && await user.checkPassword(password);
    if (isPasswordCorrect) {
      ctx.session.userId = user.id;
      return ctx.redirect('/');
    }
  } catch (e) {
    error = 'Parámetros NO válidos!';
  }
  return ctx.render('session/new', {
    email,
    createSessionPath: ctx.router.url('session.create'),
    newUserPath: ctx.router.url('users.new'),
    error,
  });
});

router.delete('session.destroy', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('session.new'));
});

module.exports = router;
