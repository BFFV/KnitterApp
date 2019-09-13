const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadComment(ctx, next) {
  ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
  return next();
}

router.get('comments.list', '/', async (ctx) => {
  const commentsList = await ctx.orm.comment.findAll();
  await ctx.render('comments/index', {
    commentsList,
    newCommentPath: ctx.router.url('comments.new'),
    commentsPath: (comment) => ctx.router.url('comments.show', { id: comment.id }),
    editCommentPath: (comment) => ctx.router.url('comments.edit', { id: comment.id }),
    deleteCommentPath: (comment) => ctx.router.url('comments.delete', { id: comment.id }),
  });
});

router.get('comments.new', '/new', async (ctx) => {
  const comment = ctx.orm.comment.build();
  const usersList = await ctx.orm.user.findAll();
  const patternsList = await ctx.orm.pattern.findAll();
  await ctx.render('comments/new', {
    comment,
    usersList,
    patternsList,
    commentsPath: ctx.router.url('comments.list'),
    submitCommentPath: ctx.router.url('comments.create'),
  });
});

router.get('comments.edit', '/:id/edit', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  const usersList = await ctx.orm.user.findAll();
  const patternsList = await ctx.orm.pattern.findAll();
  await ctx.render('comments/edit', {
    comment,
    usersList,
    patternsList,
    commentsPath: ctx.router.url('comments.list'),
    submitCommentPath: ctx.router.url('comments.update', { id: comment.id }),
  });
});

router.post('comments.create', '/', async (ctx) => {
  const comment = ctx.orm.comment.build(ctx.request.body);
  try {
    await comment.save({ fields: ['patternId', 'userId', 'content' ] });
    ctx.redirect(ctx.router.url('comments.list'));
  } catch (validationError) {
    await ctx.render('comments/new', {
      comment,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('comments.create'),
    });
  }
});

router.patch('comments.update', '/:id', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  try {
    const {
      patternId, userId, content,
    } = ctx.request.body;
    await comment.update({
      patternId, userId, content,
    });

    ctx.redirect(ctx.router.url('comments.list'));
  } catch (validationError) {
    await ctx.render('comments/edit', {
      comment,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('comments.update'),
    });
  }
});

router.del('comments.delete', '/:id', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  await comment.destroy();
  ctx.redirect(ctx.router.url('comments.list'));
});


module.exports = router;
