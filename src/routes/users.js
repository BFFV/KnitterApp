const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular user
async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  if (ctx.state.user) {
    ctx.state.access = 'user';
    ctx.state.createdPatterns = await ctx.state.user.getPatterns();
    ctx.state.usedPatterns = await ctx.state.user.getUsedPatterns();
    ctx.state.favoritePatterns = await ctx.state.user.getFavoritePatterns();
    return next();
  }
  ctx.redirect(ctx.router.url('users.list'));
  return 'Invalid User!';
}

// Checks if the current user has already followed this user
async function checkState(ctx, next) {
  let followerPath = ctx.router.url('followers.add');
  let following = false;
  if (ctx.state.currentUser) {
    const followingList = await ctx.state.currentUser.getFollowing()
      .then((users) => users.filter((x) => x.id === ctx.state.user.id));
    if (followingList.length) {
      followerPath = ctx.router.url('followers.delete');
      following = true;
    }
  }
  ctx.state.followerPath = followerPath;
  ctx.state.following = following;
  return next();
}

// Checks if the two passwords are right when creating/editing an user
async function checkPassword(ctx, next) {
  const params = ctx.request.body;
  const { user } = ctx.state;
  if (ctx.state.currentUser) {
    const pPassword = await user.checkPassword(params.p_password);
    let errors = [{ message: 'Contraseña Actual Incorrecta!' }];
    if (pPassword) {
      errors = [{ message: 'Las Contraseñas No Coinciden!' }];
      if (params.password === params.r_password) {
        return next();
      }
    }
    await ctx.render('users/edit', {
      user,
      errors,
      userPath: ctx.router.url('users.show', { id: user.id }),
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
    });
  } else if (params.password === params.r_password) {
    return next();
  } else {
    const errors = [{ message: 'Las contraseñas no coinciden!' }];
    await ctx.render('users/new', {
      user: ctx.orm.user.build(ctx.request.body),
      errors,
      rootPath: '/',
      submitUserPath: ctx.router.url('users.create'),
    });
  }
  return 'Passwords are not equal!';
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  const current = ctx.state.currentUser;
  if (ctx.state.access !== 'user') {
    if ((current) && (current.role === 'admin')) {
      return next();
    }
  } else if ((current) && (current.id === ctx.state.user.id)) {
    return next();
  } else if ((ctx.request.method === 'DELETE') && (current.role === 'admin')) {
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

router.post('users.create', '/', checkPassword, async (ctx) => {
  const params = ctx.request.body;
  params.role = 'common';
  params.token = params.username;
  const user = ctx.orm.user.build(params);
  try {
    await user.save({ fields: ['username', 'password', 'email', 'age', 'photo', 'role', 'token'] });
    ctx.redirect(ctx.router.url('session.new'));
  } catch (validationError) {
    let { errors } = validationError;
    if (validationError.name === 'SequelizeUniqueConstraintError') {
      errors = [{ message: 'El nombre de usuario o correo ya están en uso!' }];
    } else if (!errors) {
      errors = [{ message: 'Parámetros NO válidos!' }];
    }
    await ctx.render('users/new', {
      user,
      errors,
      rootPath: '/',
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.patch('users.update', '/:id', loadUser, authenticate, checkPassword, async (ctx) => {
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

router.get('users.show', '/:id', loadUser, checkState, async (ctx) => {
  const {
    user, createdPatterns, followerPath, following, usedPatterns, favoritePatterns,
  } = ctx.state;
  await ctx.render('users/show', {
    user,
    following,
    followerPath,
    usedPatterns,
    favoritePatterns,
    createdPatterns,
    usersPath: ctx.router.url('users.list'),
    editUserPath: ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: ctx.router.url('users.delete', { id: user.id }),
    patternPath: (pattern) => ctx.router.url('patterns.show', { id: pattern.id }),
  });
});

module.exports = router;
