const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.categories.all', '/', async (ctx) => {
  try {
    const categories = await ctx.orm.category.findAll();
    categories.sort((a, b) => a.name.localeCompare(b.name));
    ctx.body = ctx.jsonSerializer('categories', {
      attributes: ['id', 'name'],
      topLevelLinks: {
        self: `${ctx.origin}${ctx.router.url('api.categories.all')}`,
      },
    }).serialize(categories);
  } catch (validationError) {
    ctx.throw(400, 'Parámetros Inválidos');
  }
});

module.exports = router;
