const KoaRouter = require('koa-router');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = new KoaRouter();


async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  ctx.state.user.password = '';
  return next();
}

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    userPath: (user) => ctx.router.url('users.show', { id: user.id }),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
  });
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    userPath: ctx.router.url('users.list'),
    submitUserPath: ctx.router.url('users.create'),
  });
});


router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    userPath: ctx.router.url('users.list'),
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  
  try {
    await bcrypt.hash(user.password, saltRounds).then(function(hash) {
      user.password = hash;
    });
    await user.save({ fields: ['username', 'password','email', 'age', 'photo', 'role'] });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const username = ctx.request.body.username;
    const email = ctx.request.body.email;
    const age = ctx.request.body.age;
    const photo = ctx.request.body.photo;
    const role = ctx.request.body.role;
    await bcrypt.hash(ctx.request.body.password, saltRounds).then(function(hash) {
      password = hash;
    });
    await user.update({
      username, password, email, age, photo, role
    });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update'),
    });
  }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

module.exports = router;
