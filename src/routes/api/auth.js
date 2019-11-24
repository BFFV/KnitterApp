const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();

router.get('app.auth', '/', async (ctx) => {
  if (ctx.state.currentUser) {
    const token = await new Promise((resolve, reject) => {
      jwtgenerator.sign(
        { userId: ctx.state.currentUser.id },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
      );
    });
    ctx.body = { token };
  } else {
    ctx.throw(401, 'No has iniciado sesión!');
  }
});

router.get('app.user', '/user', async (ctx) => {
  if (ctx.state.currentUser) {
    ctx.body = ctx.jsonSerializer('user', {
      attributes: ['username', 'email', 'age', 'role', 'popularity'],
    }).serialize(ctx.state.currentUser);
  } else {
    ctx.body = ctx.jsonSerializer('user', { visit: true });
  }
});

router.post('auth', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { email } });
  if (user && await user.checkPassword(password)) {
    const token = await new Promise((resolve, reject) => {
      jwtgenerator.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
      );
    });
    ctx.body = { token };
  } else {
    ctx.throw(401, 'Email o Contraseña incorrectos!');
  }
});

module.exports = router;
