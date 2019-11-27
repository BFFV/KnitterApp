const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular vote for a pattern
async function loadVotePattern(ctx, next) {
  ctx.state.votePattern = await ctx.orm.vote_pattern.findByPk(ctx.params.id);
  if (ctx.state.votePattern) {
    return next();
  }
  ctx.redirect('/');
  return 'Invalid VotePattern!';
}

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
  const current = ctx.state.currentUser;
  if ((ctx.request.method !== 'POST')) {
    if ((current) && (current.id === ctx.state.votePattern.userId)) {
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

router.post('vote_patterns.create', '/', authenticate, validate, updatePattern, async (ctx) => {
  const params = ctx.request.body;
  params.userId = ctx.state.currentUser.id;
  const votePattern = ctx.orm.vote_pattern.build(params);
  const { patternId } = ctx.request.body;
  try {
    await votePattern.save({ fields: ['patternId', 'userId', 'rating'] });
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
  }
  return patternId;
});

router.patch('vote_patterns.update', '/:id', loadVotePattern, authenticate, updatePattern, async (ctx) => {
  const { votePattern } = ctx.state;
  try {
    const { rating } = ctx.request.body;
    await votePattern.update({ rating });
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: votePattern.patternId }));
  }
  return votePattern.patternId;
});

module.exports = router;
