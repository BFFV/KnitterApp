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

router.post('user_patterns.add', '/', authenticate, validate, async (ctx) => {
  const user = ctx.state.currentUser;
  const { patternId } = ctx.request.body;
  try {
    await user.addUsedPattern(patternId);
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  }
  return patternId;
});

router.del('user_patterns.delete', '/', authenticate, validate, async (ctx) => {
  const user = ctx.state.currentUser;
  const { patternId } = ctx.request.body;
  try {
    await user.removeUsedPattern(patternId);
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  }
  return patternId;
});

router.post('user_patterns.favorite', '/favorite', authenticate, validate, async (ctx) => {
  const user = ctx.state.currentUser;
  const { patternId } = ctx.request.body;
  try {
    await user.addFavoritePattern(patternId);
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  }
  return patternId;
});

router.del('user_patterns.remove', '/favorite', authenticate, validate, async (ctx) => {
  const user = ctx.state.currentUser;
  const { patternId } = ctx.request.body;
  try {
    await user.removeFavoritePattern(patternId);
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  }
  return patternId;
});

module.exports = router;
