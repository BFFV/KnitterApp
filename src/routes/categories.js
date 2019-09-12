const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadCategory(ctx, next) {
  ctx.state.category = await ctx.orm.category.findByPk(ctx.params.id);
  return next();
}

router.get('categories.list', '/', async (ctx) => {
  const categoriesList = await ctx.orm.category.findAll();
  await ctx.render('categories/index', {
    categoriesList,
    newCategoryPath: ctx.router.url('categories.new'),
    categoryPath: (category) => ctx.router.url('categories.show', { id: category.id }),
    editCategoryPath: (category) => ctx.router.url('categories.edit', { id: category.id }),
    deleteCategoryPath: (category) => ctx.router.url('categories.delete', { id: category.id }),
  });
});

router.get('categories.new', '/new', async (ctx) => {
  const category = ctx.orm.category.build();
  await ctx.render('categories/new', {
    category,
    categoriesPath: ctx.router.url('categories.list'),
    submitCategoryPath: ctx.router.url('categories.create'),
  });
});

router.get('categories.edit', '/:id/edit', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  await ctx.render('categories/edit', {
    category,
    categoriesPath: ctx.router.url('categories.list'),
    submitCategoryPath: ctx.router.url('categories.update', { id: category.id }),
  });
});

router.post('categories.create', '/', async (ctx) => {
  const category = ctx.orm.category.build(ctx.request.body);
  try {
    await category.save({ fields: ['name', 'description'] });
    ctx.redirect(ctx.router.url('categories.list'));
  } catch (validationError) {
    await ctx.render('categories/new', {
      category,
      errors: validationError.errors,
      submitCategoryPath: ctx.router.url('categories.create'),
    });
  }
});

router.patch('categories.update', '/:id', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  try {
    const {
      name, instructions, image, video,
    } = ctx.request.body;
    await category.update({
      name, instructions, image, video,
    });
    ctx.redirect(ctx.router.url('categories.list'));
  } catch (validationError) {
    await ctx.render('categories/edit', {
      category,
      errors: validationError.errors,
      submitCategoryPath: ctx.router.url('categories.update'),
    });
  }
});

router.del('categories.delete', '/:id', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  await category.destroy();
  ctx.redirect(ctx.router.url('categories.list'));
});



module.exports = router;
