const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('patterns', '/', async (ctx) => {
  const patterns = await ctx.orm.pattern.findAll();
  await ctx.render('patterns/index', { patterns });
});

module.exports = router;
