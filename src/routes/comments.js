const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular comment
async function loadComment(ctx, next) {
  ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
  if (ctx.state.comment) {
    return next();
  }
  ctx.redirect('/');
  return 'Invalid Comment!';
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  const current = ctx.state.currentUser;
  if ((ctx.request.method !== 'POST')) {
    if ((current) && ((current.role === 'admin') || (current.id === ctx.state.comment.userId))) {
      return next();
    }
  } else if (current) {
    return next();
  }
  ctx.redirect('/');
  return 'Unauthorized Access!';
}

// Validates required parameters
async function validate(ctx, next) {
  if (!parseInt(ctx.request.body.patternId, 10)) {
    ctx.redirect(ctx.router.url('patterns.list'));
    return 'Invalid Pattern!';
  }
  const exists = await ctx.orm.pattern.findByPk(ctx.request.body.patternId);
  if (exists) {
    return next();
  }
  ctx.redirect(ctx.router.url('patterns.list'));
  return 'Invalid Pattern!';
}

router.get('comments.edit', '/:id/edit', loadComment, authenticate, async (ctx) => {
  const { comment } = ctx.state;
  await ctx.render('comments/edit', {
    comment,
    patternPath: ctx.router.url('patterns.show', { id: comment.patternId }),
    submitCommentPath: ctx.router.url('comments.update', { id: comment.id }),
  });
});

router.post('comments.create', '/', authenticate, validate, async (ctx) => {
  const params = ctx.request.body;
  params.userId = ctx.state.currentUser.id;
  const comment = ctx.orm.comment.build(params);
  const { patternId } = ctx.request.body;
  try {
    await comment.save({ fields: ['patternId', 'userId', 'content'] });
    ctx.redirect(ctx.router.url('patterns.show', { id: comment.patternId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  }
});

router.patch('comments.update', '/:id', loadComment, authenticate, async (ctx) => {
  const { comment } = ctx.state;
  try {
    const { content } = ctx.request.body;
    await comment.update({ content });
    ctx.redirect(ctx.router.url('patterns.show', { id: comment.patternId }));
  } catch (validationError) {
    await ctx.render('comments/edit', {
      comment,
      patternPath: ctx.router.url('patterns.show', { id: comment.patternId }),
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('comments.update', { id: comment.id }),
    });
  }
});

router.del('comments.delete', '/:id', loadComment, authenticate, async (ctx) => {
  const { comment } = ctx.state;
  const { patternId } = comment;
  await comment.destroy();
  ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
});

module.exports = router;
