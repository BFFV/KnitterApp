const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular pattern
async function loadPattern(ctx, next) {
  ctx.state.pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  return next();
}

// Sets the materials used for a pattern
async function setMaterials(materials, pattern) {
  if (materials) {
    if (typeof (materials) === 'string') {
      const keys = [parseInt(materials, 10)];
      await pattern.setMaterials(keys);
    } else {
      const keys = materials.map(Number);
      await pattern.setMaterials(keys);
    }
  } else {
    await pattern.setMaterials([]);
  }
}

// Calculates the score of a particular pattern
async function getScore(pattern) {
  const scoreList = await pattern.getVote_patterns();
  const average = scoreList.reduce((total, next) => total + next.rating, 0)
  / scoreList.length;
  if (!average) {
    return 0;
  }
  return average;
}

// Calculates the score of multiple patterns
async function getScoreArray(array) {
  const asyncScores = [];
  array.forEach((pattern) => asyncScores.push(getScore(pattern)));
  return Promise.all(asyncScores);
}

// Obtains the possible categories & materials for a new pattern
async function newPatternInfo(ctx) {
  const info = {};
  info.categoriesList = await ctx.orm.category.findAll();
  info.materialsList = await ctx.orm.material.findAll();
  return info;
}

router.get('patterns.list', '/', async (ctx) => {
  const patternsList = await ctx.orm.pattern.findAll();
  const votePatternsList = await ctx.orm.vote_pattern.findAll();
  const patternScores = await getScoreArray(patternsList);
  for (let i = 0; i < patternsList.length; i += 1) {
    patternsList[i].score = patternScores[i];
  }
  await ctx.render('patterns/index', {
    patternsList,
    votePatternsList,
    newPatternPath: ctx.router.url('patterns.new'),
    patternPath: (pattern) => ctx.router.url('patterns.show', { id: pattern.id }),
    editPatternPath: (pattern) => ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: (pattern) => ctx.router.url('patterns.delete', { id: pattern.id }),
  });
});

router.get('patterns.new', '/new', async (ctx) => {
  const pattern = ctx.orm.pattern.build();
  const { categoriesList, materialsList } = await newPatternInfo(ctx);
  const materials = [];
  await ctx.render('patterns/new', {
    pattern,
    categoriesList,
    materials,
    materialsList,
    patternsPath: ctx.router.url('patterns.list'),
    submitPatternPath: ctx.router.url('patterns.create'),
  });
});

router.get('patterns.edit', '/:id/edit', loadPattern, async (ctx) => {
  if (!ctx.state.currentUser) {
    ctx.state.flashMessage.warning = 'Acción NO permitida!';
    ctx.redirect(ctx.router.url('patterns.list'));
  }
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
  ctx.params = ctx.request.body;
  if (ctx.state.currentUser) {
    ctx.params.authorId = ctx.state.currentUser.id;
  }
  const pattern = ctx.orm.pattern.build(ctx.params);
  let { materials } = ctx.params;
  try {
    await pattern.save(
      {
        fields: ['name', 'instructions', 'image', 'video', 'tension', 'authorId', 'categoryId'],
      },
    );
    await setMaterials(materials, pattern);
    ctx.redirect(ctx.router.url('patterns.list'));
  } catch (validationError) {
    const { categoriesList, materialsList } = await newPatternInfo(ctx);
    materials = [];
    await ctx.render('patterns/new', {
      pattern,
      categoriesList,
      materials,
      materialsList,
      errors: validationError.errors,
      patternsPath: ctx.router.url('patterns.list'),
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
  if (ctx.state.currentUser) {
    const { pattern } = ctx.state;
    await pattern.destroy();
  } else {
    ctx.state.flashMessage.warning = 'Acción NO permitida!';
  }
  ctx.redirect(ctx.router.url('patterns.list'));
});

router.get('patterns.show', '/:id', loadPattern, async (ctx) => {
  const { pattern } = ctx.state;
  pattern.score = await getScore(pattern);
  const author = await pattern.getUser();
  const category = await pattern.getCategory();
  const materials = await pattern.getMaterials();
  const commentsList = await pattern.getComments();
  const votePattern = ctx.orm.vote_pattern.build();
  const comment = ctx.orm.comment.build();
  const options = [1, 2, 3, 4, 5];
  await ctx.render('patterns/show', {
    pattern,
    author,
    votePattern,
    comment,
    options,
    category,
    materials,
    commentsList,
    submitVotePatternPath: ctx.router.url('vote_patterns.create'),
    patternsPath: ctx.router.url('patterns.list'),
    submitCommentPath: ctx.router.url('comments.create'),
    editCommentPath: (c) => ctx.router.url('comments.edit', { id: c.id }),
    deleteCommentPath: (c) => ctx.router.url('comments.delete', { id: c.id }),
  });
});

module.exports = router;
