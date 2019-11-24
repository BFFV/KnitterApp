const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

// Searches for patterns
async function searchPatterns(ctx, next) {
  const params = ctx.request.query;
  let patterns = [];
  if (params.name) {
    patterns = await ctx.orm.pattern.findAll({
      where: { name: { [ctx.orm.Sequelize.Op.iLike]: `%${params.name}%` } },
    });
  } else {
    patterns = await ctx.orm.pattern.findAll();
  }
  ctx.state.patternsList = patterns;
  if (params.sorting === 'rating') {
    ctx.state.patternsList.sort((a, b) => a.score - b.score).reverse();
  } else if (params.sorting === 'popular') {
    ctx.state.patternsList.sort((a, b) => a.popularity - b.popularity).reverse();
  } else {
    ctx.state.patternsList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  }
  if (params.sorting) {
    ctx.state.sorting = params.sorting;
  }
  return next();
}

router.get('/', searchPatterns, async (ctx) => {
  await ctx.render('index', {
    patterns: ctx.state.patternsList,
    selSorting: ctx.state.sorting,
    options: [['recent', 'Más Reciente'], ['popular', 'Más Popular'], ['rating', 'Mejor Valorado']],
    appVersion: pkg.version,
    patternPath: (pattern) => ctx.router.url('patterns.show', { id: pattern.id }),
    editPatternPath: (pattern) => ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: (pattern) => ctx.router.url('patterns.delete', { id: pattern.id }),
  });
});

module.exports = router;
