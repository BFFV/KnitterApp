const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular category
async function loadCategory(ctx, next) {
  ctx.state.category = await ctx.orm.category.findByPk(ctx.params.id);
  if (ctx.state.category) {
    return next();
  }
  ctx.redirect(ctx.router.url('categories.list'));
  return 'Invalid Category!';
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

router.get('categories.list', '/', authenticate, async (ctx) => {
  const categoriesList = await ctx.orm.category.findAll();
  categoriesList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  await ctx.render('categories/index', {
    categoriesList,
    newCategoryPath: ctx.router.url('categories.new'),
    editCategoryPath: (category) => ctx.router.url('categories.edit', { id: category.id }),
    deleteCategoryPath: (category) => ctx.router.url('categories.delete', { id: category.id }),
    rootPath: '/',
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
    let { errors } = validationError;
    if (!errors.length) {
      errors = [{ message: 'Ese nombre ya está en uso!' }];
    }
    await ctx.render('categories/new', {
      category,
      errors,
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
    let { errors } = validationError;
    if (!errors.length) {
      errors = [{ message: 'Ese nombre ya está en uso!' }];
    }
    await ctx.render('categories/edit', {
      category,
      errors,
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
