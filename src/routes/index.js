const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();


router.get('/', async (ctx) => {
  const patterns = await ctx.orm.pattern.findAll();
  await ctx.render('index', {
    patterns,
    appVersion: pkg.version,
    patternPath: (pattern) => ctx.router.url('patterns.show', { id: pattern.id }),
  });
});

module.exports = router;
