const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadMaterial(ctx, next) {
  ctx.state.material = await ctx.orm.material.findByPk(ctx.params.id);
  return next();
}

router.get('materials.list', '/', async (ctx) => {
  const materialsList = await ctx.orm.material.findAll();
  await ctx.render('materials/index', {
    materialsList,
    newMaterialPath: ctx.router.url('materials.new'),
    materialPath: (material) => ctx.router.url('materials.show', { id: material.id }),
    editMaterialPath: (material) => ctx.router.url('materials.edit', { id: material.id }),
    deleteMaterialPath: (material) => ctx.router.url('materials.delete', { id: material.id }),
  });
});

router.get('materials.new', '/new', async (ctx) => {
  const material = ctx.orm.material.build();
  await ctx.render('materials/new', {
    material,
    materialsPath: ctx.router.url('materials.list'),
    submitMaterialPath: ctx.router.url('materials.create'),
  });
});

router.get('materials.edit', '/:id/edit', loadMaterial, async (ctx) => {
  const { material } = ctx.state;
  await ctx.render('materials/edit', {
    material,
    materialsPath: ctx.router.url('materials.list'),
    submitMaterialPath: ctx.router.url('materials.update', { id: material.id }),
  });
});

router.post('materials.create', '/', async (ctx) => {
  const material = ctx.orm.material.build(ctx.request.body);
  try {
    await material.save({ fields: ['name', 'description'] });
    ctx.redirect(ctx.router.url('materials.list'));
  } catch (validationError) {
    await ctx.render('materials/new', {
      material,
      errors: validationError.errors,
      submitMaterialPath: ctx.router.url('materials.create'),
    });
  }
});

router.patch('materials.update', '/:id', loadMaterial, async (ctx) => {
  const { material } = ctx.state;
  try {
    const {
      name, instructions, image, video,
    } = ctx.request.body;
    await material.update({
      name, instructions, image, video,
    });
    ctx.redirect(ctx.router.url('materials.list'));
  } catch (validationError) {
    await ctx.render('materials/edit', {
      material,
      errors: validationError.errors,
      submitMaterialPath: ctx.router.url('materials.update'),
    });
  }
});

router.del('materials.delete', '/:id', loadMaterial, async (ctx) => {
  const { material } = ctx.state;
  await material.destroy();
  ctx.redirect(ctx.router.url('materials.list'));
});



module.exports = router;