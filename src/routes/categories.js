const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular category
async function loadCategory(ctx, next) {
  ctx.state.category = await ctx.orm.category.findByPk(ctx.params.id);
  return next();
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  if (!ctx.state.currentUser) {
    ctx.redirect('/');
  } else if (ctx.state.currentUser.role === 'common') {
    ctx.redirect('/');
  }
  return next();
}

router.get('categories.list', '/', authenticate, async (ctx) => {
  const categoriesList = await ctx.orm.category.findAll();
  await ctx.render('categories/index', {
    categoriesList,
    newCategoryPath: ctx.router.url('categories.new'),
    categoryPath: (category) => ctx.router.url('categories.show', { id: category.id }),
    editCategoryPath: (category) => ctx.router.url('categories.edit', { id: category.id }),
    deleteCategoryPath: (category) => ctx.router.url('categories.delete', { id: category.id }),
  });
});

router.get('categories.new', '/new', authenticate, async (ctx) => {
  const category = ctx.orm.category.build();
  await ctx.render('categories/new', {
    category,
    categoriesPath: ctx.router.url('categories.list'),
    submitCategoryPath: ctx.router.url('categories.create'),
  });
});

router.get('categories.edit', '/:id/edit', authenticate, loadCategory, async (ctx) => {
  const { category } = ctx.state;
  await ctx.render('categories/edit', {
    category,
    categoriesPath: ctx.router.url('categories.list'),
    submitCategoryPath: ctx.router.url('categories.update', { id: category.id }),
  });
});

router.post('categories.create', '/', authenticate, async (ctx) => {
  const category = ctx.orm.category.build(ctx.request.body);
  try {
    await category.save({ fields: ['name', 'description'] });
    ctx.redirect(ctx.router.url('categories.list'));
  } catch (validationError) {
    await ctx.render('categories/new', {
      category,
      errors: validationError.errors,
      categoriesPath: ctx.router.url('categories.list'),
      submitCategoryPath: ctx.router.url('categories.create'),
    });
  }
});

router.patch('categories.update', '/:id', authenticate, loadCategory, async (ctx) => {
  const { category } = ctx.state;
  try {
    const {
      name, description,
    } = ctx.request.body;
    await category.update({
      name, description,
    });
    ctx.redirect(ctx.router.url('categories.list'));
  } catch (validationError) {
    await ctx.render('categories/edit', {
      category,
      errors: validationError.errors,
      categoriesPath: ctx.router.url('categories.list'),
      submitCategoryPath: ctx.router.url('categories.update'),
    });
  }
});

router.del('categories.delete', '/:id', authenticate, loadCategory, async (ctx) => {
  const { category } = ctx.state;
  await category.destroy();
  ctx.redirect(ctx.router.url('categories.list'));
});

module.exports = router;
