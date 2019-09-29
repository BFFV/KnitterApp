const KoaRouter = require('koa-router');

const index = require('./routes/index');
const patterns = require('./routes/patterns');
const categories = require('./routes/categories');
const materials = require('./routes/materials');
const users = require('./routes/users');
const session = require('./routes/session');
const votePatterns = require('./routes/vote_patterns');
const comments = require('./routes/comments');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    currentUser: ctx.session.userId && await ctx.orm.user.findByPk(ctx.session.userId),
    newSessionPath: ctx.router.url('session.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
  });
  return next();
});

router.use('/', index.routes());
router.use('/patterns', patterns.routes());
router.use('/categories', categories.routes());
router.use('/materials', materials.routes());
router.use('/users', users.routes());
router.use('/session', session.routes());
router.use('/vote_patterns', votePatterns.routes());
router.use('/comments', comments.routes());

module.exports = router;
