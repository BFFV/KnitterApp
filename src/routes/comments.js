const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadComment(ctx, next) {
  ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
  return next();
};

async function loadPattern(ctx, next) {
  ctx.state.pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  return next();
};

router.get('comments.list', '/', async (ctx) => {
  const commentsList = await ctx.orm.comment.findAll();
  console.log(commentsList);
  await ctx.render('comments/index', {
    commentsList,
  });
});

router.get('comments.new', '/:id/new', loadPattern, async (ctx) => {
  const { pattern } = ctx.state;
  console.log(pattern)
  const comment = ctx.orm.comment.build();
  const usersList = await ctx.orm.user.findAll();
  const patternsList = await ctx.orm.pattern.findAll();
  const patternId = pattern.id;
  await ctx.render('comments/new', {
    comment,
    usersList,
    patternsList,
    patternId,
    commentsPath: ctx.router.url('comments.list'),
    submitCommentPath: ctx.router.url('comments.create'),
  });
});

router.get('comments.edit', '/:id/edit', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  const patternId = comment.patternId;
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('comments/edit', {
    comment,
    usersList,
    patternId,
    commentsPath: ctx.router.url('comments.list'),
    submitCommentPath: ctx.router.url('comments.update', { id: comment.id }),
  });
});

router.post('comments.create', '/', async (ctx) => {
  const comment = ctx.orm.comment.build(ctx.request.body);
  try {
    await comment.save({ fields: ['patternId', 'userId', 'content' ] });
    ctx.redirect(ctx.router.url('patterns.show', { id: comment.patternId }));
  } catch (validationError) {
    await ctx.render('comments/new', {
      comment,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('comments.create'),
    });
  }
});

router.patch('comments.update', '/', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  console.log(comment)
  try {
    const {
      patternId, userId, content,
    } = ctx.request.body;
    await comment.update({
      patternId, userId, content,
    });
    ctx.redirect(ctx.router.url('patterns.show', { id: comment.patternId }))
  } catch (validationError) {
    await ctx.render('comments/edit', {
      comment,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('/'),
    });
  }
});

router.del('comments.delete', '/:id', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  const patternId = comment.patternId;
  await comment.destroy();
  ctx.redirect(ctx.router.url('patterns.show', { id: patternId }))
});


module.exports = router;
