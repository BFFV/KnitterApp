const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular vote for a pattern
async function loadVotePattern(ctx, next) {
  ctx.state.votePattern = await ctx.orm.vote_pattern.findByPk(ctx.params.id);
  return next();
}

router.post('vote_patterns.create', '/', async (ctx) => {
  const votePattern = ctx.orm.vote_pattern.build(ctx.request.body);
  const { patternId } = ctx.request.body;
  try {
    await votePattern.save({ fields: ['patternId', 'userId', 'rating'] });
    ctx.redirect(ctx.router.url('patterns.show', { id: votePattern.patternId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: patternId, errors: validationError.errors }));
  }
});

router.patch('vote_patterns.update', '/:id', loadVotePattern, async (ctx) => {
  const { votePattern } = ctx.state;
  try {
    const { rating } = ctx.request.body;
    await votePattern.update({ rating });
    ctx.redirect(ctx.router.url('patterns.show', { id: votePattern.patternId }));
  } catch (validationError) {
    ctx.redirect(ctx.router.url('patterns.show', { id: votePattern.patternId }));
  }
});

module.exports = router;
