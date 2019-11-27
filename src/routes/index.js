const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const patterns = await ctx.orm.pattern.findAll();
  let favorites = [];
  if (ctx.state.currentUser) {
    const favoritesLoad = await ctx.state.currentUser.getFavoritePatterns();
    favorites = favoritesLoad.slice(0, 4);
  }
  const patternsNewer = patterns.sort((a, b) => a.updatedAt - b.updatedAt).reverse().slice(0, 4);
  const patternsPopular = patterns.sort((a, b) => a.popularity - b.popularity)
    .reverse().slice(0, 4);
  const patternsValues = patterns.sort((a, b) => a.score - b.score).reverse().slice(0, 4);
  await ctx.render('index', {
    favorites,
    patternsNewer,
    patternsPopular,
    patternsValues,
    patternPath: (pattern) => ctx.router.url('patterns.show', { id: pattern.id }),
    editPatternPath: (pattern) => ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: (pattern) => ctx.router.url('patterns.delete', { id: pattern.id }),
  });
});

module.exports = router;
