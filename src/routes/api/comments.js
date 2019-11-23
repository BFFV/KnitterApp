const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function authenticate(ctx, next) {
  ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
  if (!ctx.state.comment) {
    return ctx.throw(400, 'Parámetros Inválidos!');
  }
  const current = ctx.state.currentUser;
  if ((current.role === 'admin') || (current.id === ctx.state.comment.userId)) {
    return next();
  }
  return ctx.throw(403, 'Acceso Denegado!');
}

router.post('api.comments.post', '/', async (ctx) => {
  const params = ctx.request.body;
  params.userId = ctx.state.currentUser.id;
  const comment = ctx.orm.comment.build(params);
  try {
    await comment.save({ fields: ['patternId', 'userId', 'content'] });
    ctx.body = ctx.jsonSerializer('msg', 'success');
  } catch (validationError) {
    ctx.throw(400, 'Parámetros Inválidos!');
  }
});

router.patch('api.comments.edit', '/:id/edit', authenticate, async (ctx) => {
  const { comment } = ctx.state;
  try {
    const { content } = ctx.request.body;
    await comment.update({ content });
    ctx.body = ctx.jsonSerializer('msg', 'success');
  } catch (validationError) {
    ctx.throw(400, 'Parámetros Inválidos!');
  }
});

router.del('api.comments.delete', '/:id/delete', authenticate, async (ctx) => {
  const { comment } = ctx.state;
  try {
    await comment.destroy();
    ctx.body = ctx.jsonSerializer('msg', 'success');
  } catch (validationError) {
    ctx.throw(400, 'Parámetros Inválidos!');
  }
});

module.exports = router;
