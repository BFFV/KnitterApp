
const KoaRouter = require('koa-router');
const patternsApi = require('./patterns');

const router = new KoaRouter();

router.use('/patterns', patternsApi.routes());

module.exports = router;
