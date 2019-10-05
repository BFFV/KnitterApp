const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular user
async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  ctx.state.user.password = '';
  ctx.state.access = 'user';
  return next();
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  const current = ctx.state.currentUser;
  if (ctx.state.access !== 'user') {
    if ((current) && (current.role === 'admin')) {
      return next();
    }
  } else if ((current) && ((current.role === 'admin') || (current.id === ctx.state.user.id))) {
    return next();
  }
  ctx.redirect('/');
  return 'Unauthorized Access!';
}

router.get('users.list', '/', authenticate, async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  usersList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  await ctx.render('users/index', {
    usersList,
    userPath: (user) => ctx.router.url('users.show', { id: user.id }),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
  });
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    rootPath: '/',
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.get('users.edit', '/:id/edit', loadUser, authenticate, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    userPath: ctx.router.url('users.show', { id: user.id }),
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
    rootPath: '/',
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({ fields: ['username', 'password', 'email', 'age', 'photo', 'role'] });
    ctx.redirect(ctx.router.url('session.new'));
  } catch (validationError) {
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      rootPath: '/',
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.patch('users.update', '/:id', loadUser, authenticate, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {
      username, password, email, age, photo,
    } = ctx.request.body;
    await user.update({
      username, password, email, age, photo,
    });
    ctx.redirect(ctx.router.url('users.show', { id: user.id }));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      userPath: ctx.router.url('users.show', { id: user.id }),
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
    });
  }
});

router.del('users.delete', '/:id', loadUser, authenticate, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect('/');
});

router.get('users.show', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/show', {
    user,
    rootPath: '/',
    editUserPath: ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: ctx.router.url('users.delete', { id: user.id }),
  });
});

module.exports = router;
