const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPattern(ctx, next) {
  ctx.state.pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  return next();
}

router.get('patterns.list', '/', async (ctx) => {
  const patternsList = await ctx.orm.pattern.findAll();
  await ctx.render('patterns/index', {
    patternsList,
    newPatternPath: ctx.router.url('patterns.new'),
    editPatternPath: (pattern) => ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: (pattern) => ctx.router.url('patterns.delete', { id: pattern.id }),
  });
});

router.get('patterns.new', '/new', async (ctx) => {
  const pattern = ctx.orm.pattern.build();
  await ctx.render('patterns/new', {
    pattern,
    submitPatternPath: ctx.router.url('patterns.create'),
  });
});

router.get('patterns.edit', '/:id/edit', loadPattern, async (ctx) => {
  const { pattern } = ctx.state;
  await ctx.render('patterns/edit', {
    pattern,
    submitPatternPath: ctx.router.url('patterns.update', { id: pattern.id }),
  });
});

router.post('patterns.create', '/', async (ctx) => {
  const pattern = ctx.orm.pattern.build(ctx.request.body);
  try {
    await pattern.save({ fields: ['name', 'instructions', 'image', 'video'] });
    ctx.redirect(ctx.router.url('patterns.list'));
  } catch (validationError) {
    await ctx.render('patterns/new', {
      pattern,
      errors: validationError.errors,
      submitPatternPath: ctx.router.url('patterns.create'),
    });
  }
});

router.patch('patterns.update', '/:id', loadPattern, async (ctx) => {
  const { pattern } = ctx.state;
  try {
    const {
      name, instructions, image, video,
    } = ctx.request.body;
    await pattern.update({
      name, instructions, image, video,
    });
    ctx.redirect(ctx.router.url('patterns.list'));
  } catch (validationError) {
    await ctx.render('patterns/edit', {
      pattern,
      errors: validationError.errors,
      submitPatternPath: ctx.router.url('patterns.update'),
    });
  }
});

router.del('patterns.delete', '/:id', loadPattern, async (ctx) => {
  const { pattern } = ctx.state;
  await pattern.destroy();
  ctx.redirect(ctx.router.url('patterns.list'));
});

module.exports = router;
