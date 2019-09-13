const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPattern(ctx, next) {
  ctx.state.pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  return next();
}

async function setMaterials(materials, pattern) {
  if (materials) {
    if (typeof (materials) === 'string') {
      const keys = [parseInt(materials, 10)];
      pattern.setMaterials(keys);
    }
    else {
      const keys = materials.map(Number);
      pattern.setMaterials(keys);
    }
  }
  else {
    pattern.setMaterials([]);
  }
}

async function setScore(list) {
  if (list) {
    if (typeof (materials) === 'string') {
      const keys = [parseInt(materials, 10)];
      pattern.setMaterials(keys);
    }
    else {
      const keys = materials.map(Number);
      pattern.setMaterials(keys);
    }
  }
  else {
    pattern.setMaterials([]);
  }
}




router.get('patterns.list', '/', async (ctx) => {
  const patternsList = await ctx.orm.pattern.findAll();
  const vote_patternsList = await ctx.orm.vote_pattern.findAll();

  await ctx.render('patterns/index', {
    patternsList,
    vote_patternsList,
    newPatternPath: ctx.router.url('patterns.new'),
    patternPath: (pattern) => ctx.router.url('patterns.show', { id: pattern.id }),
    editPatternPath: (pattern) => ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: (pattern) => ctx.router.url('patterns.delete', { id: pattern.id }),
  });
});

router.get('patterns.new', '/new', async (ctx) => {
  const pattern = ctx.orm.pattern.build();
  const usersList = await ctx.orm.user.findAll();
  const categoriesList = await ctx.orm.category.findAll();
  const materialsList = await ctx.orm.material.findAll();
  const materials = [];
  await ctx.render('patterns/new', {
    pattern,
    usersList,
    categoriesList,
    materials,
    materialsList,
    patternsPath: ctx.router.url('patterns.list'),
    submitPatternPath: ctx.router.url('patterns.create'),
  });
});

router.get('patterns.edit', '/:id/edit', loadPattern, async (ctx) => {
  const { pattern } = ctx.state;
  const materialsList = await ctx.orm.material.findAll();
  const materials = await pattern.getMaterials();
  await ctx.render('patterns/edit', {
    pattern,
    materials,
    materialsList,
    patternsPath: ctx.router.url('patterns.list'),
    submitPatternPath: ctx.router.url('patterns.update', { id: pattern.id }),
  });
});

router.post('patterns.create', '/', async (ctx) => {
  const pattern = ctx.orm.pattern.build(ctx.request.body);
  const { materials } = ctx.request.body;
  try {
    await pattern.save({ fields: ['name', 'instructions', 'image', 'video', 'tension', 'authorId', 'categoryId'] });
    await setMaterials(materials, pattern);
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
      name, instructions, image, video, tension, materials,
    } = ctx.request.body;
    await pattern.update({
      name, instructions, image, video, tension,
    });
    await setMaterials(materials, pattern);
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

router.get('patterns.show', '/:id', loadPattern, async (ctx) => {
  const { pattern } = ctx.state;
  const author = await ctx.orm.user.findByPk(pattern.authorId);
  const score_list = await pattern.getVote_patterns();
  const average = score_list.reduce((total, next) => total + next.rating, 0) /
  score_list.length;
  const category = await ctx.orm.category.findByPk(pattern.categoryId);
  const materials = await pattern.getMaterials();
  await ctx.render('patterns/show', {
    pattern,
    author,
    category,
    materials,
    average,
    patternsPath: ctx.router.url('patterns.list'),
  });
});

module.exports = router;
