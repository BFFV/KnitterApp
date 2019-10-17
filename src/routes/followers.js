const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Updates a pattern's score when a vote is casted
async function updatePattern(ctx, next) {
  const patternId = await next();
  const pattern = await ctx.orm.pattern.findByPk(patternId);
  const { ratingAvg } = await ctx.orm.vote_pattern.findOne({
    raw: true,
    where: {
      patternId: pattern.id,
    },
    attributes: [[ctx.orm.sequelize.fn('AVG', ctx.orm.sequelize.col('rating')), 'ratingAvg']],
  });
  const score = parseFloat(ratingAvg).toFixed(1);
  await pattern.update({ score });
  ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  if (ctx.state.currentUser) {
    return next();
  }
  ctx.redirect('/');
  return 'Unauthorized Access!';
}

// Validates required parameters
async function validate(ctx, next) {
  if (!parseInt(ctx.request.body.userId, 10)) {
    ctx.redirect(ctx.router.url('users.list'));
    return 'Invalid User!';
  }
  const exists = await ctx.orm.user.findByPk(ctx.request.body.userId);
  if ((exists) && (ctx.state.currentUser.id !== parseInt(ctx.request.body.userId, 10))) {
    return next();
  }
  ctx.redirect(ctx.router.url('users.list'));
  return 'Invalid User!';
}

router.post('followers.add', '/', authenticate, validate, async (ctx) => {
  const user = ctx.state.currentUser;
  const { userId } = ctx.request.body;
  try {
    await user.addFollowing(userId);
    ctx.redirect(ctx.router.url('users.show', { id: userId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('users.show', { id: userId }));
  }
  return userId;
});

router.del('followers.delete', '/', authenticate, validate, async (ctx) => {
  const user = ctx.state.currentUser;
  const { userId } = ctx.request.body;
  try {
    await user.removeFollowing(userId);
    ctx.redirect(ctx.router.url('users.show', { id: userId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('users.show', { id: userId }));
  }
  return userId;
});

module.exports = router;
