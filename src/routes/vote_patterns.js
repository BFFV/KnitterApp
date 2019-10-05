const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular vote for a pattern
async function loadVotePattern(ctx, next) {
  ctx.state.votePattern = await ctx.orm.vote_pattern.findByPk(ctx.params.id);
  return next();
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
  const score = parseFloat(ratingAvg);
  await pattern.update({ score });
  ctx.redirect(ctx.router.url('patterns.show', { id: patternId }));
}

router.post('vote_patterns.create', '/', updatePattern, async (ctx) => {
  const votePattern = ctx.orm.vote_pattern.build(ctx.request.body);
  const { patternId } = ctx.request.body;
  try {
    await votePattern.save({ fields: ['patternId', 'userId', 'rating'] });
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId, errors: validationError.errors }));
  }
  return patternId;
});

router.patch('vote_patterns.update', '/:id', loadVotePattern, updatePattern, async (ctx) => {
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
