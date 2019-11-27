const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const authApi = require('./auth');
const patternsApi = require('./patterns');
const patternsAuthApi = require('./patternsAuth');
const commentsApi = require('./comments');
const materialsApi = require('./materials');
const categoriesApi = require('./categories');

const router = new KoaRouter();

// unauthenticated endpoints
router.use('/patterns', patternsApi.routes());
router.use('/materials', materialsApi.routes());
router.use('/categories', categoriesApi.routes());
router.use('/auth', authApi.routes());

// JWT authentication without passthrough (error if not authenticated)
router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findByPk(ctx.state.authData.userId);
  }
  return next();
});

// authenticated endpoints
router.use('/comments', commentsApi.routes());
router.use('/patternsAuth', patternsAuthApi.routes());

module.exports = router;
