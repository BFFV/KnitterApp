const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.materials.all', '/', async (ctx) => {
  try {
    const materials = await ctx.orm.material.findAll();
    materials.sort((a, b) => a.name.localeCompare(b.name));
    ctx.body = ctx.jsonSerializer('materials', {
      attributes: ['id', 'name'],
      topLevelLinks: {
        self: `${ctx.origin}${ctx.router.url('api.materials.all')}`,
      },
    }).serialize(materials);
  } catch (validationError) {
    ctx.throw(400, 'Parámetros Inválidos');
  }
});

module.exports = router;
