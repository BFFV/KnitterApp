const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Updates an user's popularity when somebody follows him/her
async function updateUser(ctx, next) {
  const userId = await next();
  const user = await ctx.orm.user.findByPk(userId);
  const popularity = await user.getFollowedBy().then((x) => x.length);
  await user.update({ popularity });
  ctx.redirect(ctx.router.url('users.show', { id: userId }));
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  if (ctx.state.currentUser) {
    return next();
  }
  ctx.redirect('/');
  return 'Unauthorized Access!';
}

// Validates required parameters
async function validate(ctx, next) {
  if (!parseInt(ctx.request.body.userId, 10)) {
    ctx.redirect(ctx.router.url('users.list'));
    return 'Invalid User!';
  }
  const exists = await ctx.orm.user.findByPk(ctx.request.body.userId);
  if ((exists) && (ctx.state.currentUser.id !== parseInt(ctx.request.body.userId, 10))) {
    return next();
  }
  ctx.redirect(ctx.router.url('users.list'));
  return 'Invalid User!';
}

router.post('followers.add', '/', authenticate, validate, updateUser, async (ctx) => {
  const user = ctx.state.currentUser;
  const { userId } = ctx.request.body;
  try {
    await user.addFollowing(userId);
  } catch (validationError) {
    ctx.redirect(ctx.router.url('users.show', { id: userId }));
  }
  return userId;
});

router.del('followers.delete', '/', authenticate, validate, updateUser, async (ctx) => {
  const user = ctx.state.currentUser;
  const { userId } = ctx.request.body;
  try {
    await user.removeFollowing(userId);
  } catch (validationError) {
    ctx.redirect(ctx.router.url('users.show', { id: userId }));
  }
  return userId;
});

module.exports = router;
