const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function authenticate(ctx, next) {
  ctx.state.pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  if (!ctx.state.pattern) {
    return ctx.throw(400, 'Parámetros Inválidos!');
  }
  const current = ctx.state.currentUser;
  if ((current.role === 'admin') || (current.id === ctx.state.pattern.authorId)) {
    return next();
  }
  return ctx.throw(403, 'Acceso Denegado!');
}

router.del('api.patterns.delete', '/:id/delete', authenticate, async (ctx) => {
  const { pattern } = ctx.state;
  try {
    await pattern.destroy();
    ctx.body = ctx.jsonSerializer('msg', 'success');
  } catch (validationError) {
    ctx.throw(400, 'Parámetros Inválidos!');
  }
});

module.exports = router;
