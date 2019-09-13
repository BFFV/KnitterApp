const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const patterns = require('./routes/patterns');
const categories = require('./routes/categories');
const materials = require('./routes/materials');
const users = require('./routes/users');
const vote_patterns = require('./routes/vote_patterns');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/patterns', patterns.routes());
router.use('/categories', categories.routes());
router.use('/materials', materials.routes());
router.use('/users', users.routes());
router.use('/vote_patterns', vote_patterns.routes());


module.exports = router;
