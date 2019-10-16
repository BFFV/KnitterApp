const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular user
async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
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
    rootPath: '/',
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
  });
});

router.post('users.create', '/', async (ctx) => {
  const params = ctx.request.body;
  params.role = 'common';
  const user = ctx.orm.user.build(params);
  try {
    if (params.password == params.r_password) {
      await user.save({ fields: ['username', 'password', 'email', 'age', 'photo', 'role'] });
      ctx.redirect(ctx.router.url('session.new'));
    }
    else {
      errors = [{ message: 'Las contraseñas no coinciden' }]
    }
  } catch (validationError) {
    let { errors } = validationError;
    if (validationError.name === 'SequelizeUniqueConstraintError') {
      errors = [{ message: 'El nombre de usuario o correo ya están en uso!' }];
    } else if (!errors) {
      errors = [{ message: 'Parámetros NO válidos!' }];
    }
  }
  await ctx.render('users/new', {
    user,
    errors,
    rootPath: '/',
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.patch('users.update', '/:id', loadUser, authenticate, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {
      username, password, email, age, photo, r_password, a_password
    } = ctx.request.body;
    await user.update({
      username, password, email, age, photo,
    });
    ctx.redirect(ctx.router.url('users.show', { id: user.id }));
  } catch (validationError) {
    let { errors } = validationError;
    if (validationError.name === 'SequelizeUniqueConstraintError') {
      errors = [{ message: 'El nombre de usuario o correo ya están en uso!' }];
    } else if (!errors) {
      errors = [{ message: 'Parámetros NO válidos!' }];
    }
    await ctx.render('users/edit', {
      user,
      errors,
      userPath: ctx.router.url('users.show', { id: user.id }),
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
    });
  }
});

router.del('users.delete', '/:id', loadUser, authenticate, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

router.get('users.show', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/show', {
    user,
    usersPath: ctx.router.url('users.list'),
    editUserPath: ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: ctx.router.url('users.delete', { id: user.id }),
  });
});

module.exports = router;
