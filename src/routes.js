const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const patterns = require('./routes/patterns');
const categories = require('./routes/categories');
const materials = require('./routes/materials');
const users = require('./routes/users');
const session = require('./routes/session');
const vote_patterns = require('./routes/vote_patterns');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    currentUser: ctx.session.userId && await ctx.orm.user.findByPk(ctx.session.userId),
    newSessionPath: ctx.router.url('session.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    coursesPath: ctx.router.url('courses.list'),
  });
  return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/patterns', patterns.routes());
router.use('/categories', categories.routes());
router.use('/materials', materials.routes());
router.use('/users', users.routes());
router.use('/session', session.routes());
router.use('/vote_patterns', vote_patterns.routes());



module.exports = router;
