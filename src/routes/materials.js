const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular material
async function loadMaterial(ctx, next) {
  ctx.state.material = await ctx.orm.material.findByPk(ctx.params.id);
  return next();
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  const current = ctx.state.currentUser;
  if (ctx.request.method === 'DELETE') {
    if ((current) && (current.role === 'admin')) {
      return next();
    }
  } else if ((current) && ((current.role === 'admin') || (current.role === 'top'))) {
    return next();
  }
  ctx.redirect('/');
  return 'Unauthorized Access!';
}

router.get('materials.list', '/', authenticate, async (ctx) => {
  const materialsList = await ctx.orm.material.findAll();
  materialsList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  await ctx.render('materials/index', {
    materialsList,
    newMaterialPath: ctx.router.url('materials.new'),
    editMaterialPath: (material) => ctx.router.url('materials.edit', { id: material.id }),
    deleteMaterialPath: (material) => ctx.router.url('materials.delete', { id: material.id }),
  });
});

router.get('materials.new', '/new', authenticate, async (ctx) => {
  const material = ctx.orm.material.build();
  await ctx.render('materials/new', {
    material,
    materialsPath: ctx.router.url('materials.list'),
    submitMaterialPath: ctx.router.url('materials.create'),
  });
});

router.get('materials.edit', '/:id/edit', authenticate, loadMaterial, async (ctx) => {
  const { material } = ctx.state;
  await ctx.render('materials/edit', {
    material,
    materialsPath: ctx.router.url('materials.list'),
    submitMaterialPath: ctx.router.url('materials.update', { id: material.id }),
  });
});

router.post('materials.create', '/', authenticate, async (ctx) => {
  const material = ctx.orm.material.build(ctx.request.body);
  try {
    await material.save({ fields: ['name', 'description'] });
    ctx.redirect(ctx.router.url('materials.list'));
  } catch (validationError) {
    await ctx.render('materials/new', {
      material,
      errors: validationError.errors,
      materialsPath: ctx.router.url('materials.list'),
      submitMaterialPath: ctx.router.url('materials.create'),
    });
  }
});

router.patch('materials.update', '/:id', authenticate, loadMaterial, async (ctx) => {
  const { material } = ctx.state;
  try {
    const {
      name, description,
    } = ctx.request.body;
    await material.update({
      name, description,
    });
    ctx.redirect(ctx.router.url('materials.list'));
  } catch (validationError) {
    await ctx.render('materials/edit', {
      material,
      errors: validationError.errors,
      materialsPath: ctx.router.url('materials.list'),
      submitMaterialPath: ctx.router.url('materials.update'),
    });
  }
});

router.del('materials.delete', '/:id', authenticate, loadMaterial, async (ctx) => {
  const { material } = ctx.state;
  await material.destroy();
  ctx.redirect(ctx.router.url('materials.list'));
});

module.exports = router;
