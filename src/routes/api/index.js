
const KoaRouter = require('koa-router');
const coursesApi = require('../patterns');

const router = new KoaRouter();

router.use('/patterns', coursesApi.routes());

module.exports = router;
