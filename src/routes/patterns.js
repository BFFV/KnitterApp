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

// Checks if the user has already voted a pattern
async function checkVote(ctx) {
  let vote = await ctx.orm.vote_pattern.findOne({
    where: {
      userId: ctx.state.currentUser.id,
      patternId: ctx.state.pattern.id,
    },
  });
  if (!vote) {
    vote = ctx.orm.vote_pattern.build();
  }
  return vote;
}

router.get('patterns.list', '/', async (ctx) => {
  const patternsList = await ctx.orm.pattern.findAll();
  patternsList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
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
    ctx.redirect(ctx.router.url('patterns.list'));
  }
  const { pattern } = ctx.state;
  const materialsList = await ctx.orm.material.findAll();
  const materials = await pattern.getMaterials();
  await ctx.render('patterns/edit', {
    pattern,
    materials,
    materialsList,
    patternPath: ctx.router.url('patterns.show', { id: pattern.id }),
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
    ctx.redirect(ctx.router.url('patterns.show', { id: pattern.id }));
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
  const materialsList = await ctx.orm.material.findAll();
  const patternMaterials = await pattern.getMaterials();
  try {
    const {
      name, instructions, image, video, tension, materials,
    } = ctx.request.body;
    await pattern.update({
      name, instructions, image, video, tension,
    });
    await setMaterials(materials, pattern);
    ctx.redirect(ctx.router.url('patterns.show', { id: pattern.id }));
  } catch (validationError) {
    await ctx.render('patterns/edit', {
      pattern,
      materials: patternMaterials,
      materialsList,
      errors: validationError.errors,
      patternPath: ctx.router.url('patterns.show', { id: pattern.id }),
      submitPatternPath: ctx.router.url('patterns.update', { id: pattern.id }),
    });
  }
});

router.del('patterns.delete', '/:id', loadPattern, async (ctx) => {
  if (ctx.state.currentUser) {
    const { pattern } = ctx.state;
    await pattern.destroy();
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
  commentsList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  const commentUsers = commentsList.map((c) => c.getUser());
  const usersList = await Promise.all(commentUsers);
  const patternComments = commentsList.map((e, i) => [e, usersList[i]]);
  let path = ctx.router.url('vote_patterns.create');
  let votePattern = null;
  if (ctx.state.currentUser) {
    votePattern = await checkVote(ctx);
    if (!votePattern.isNewRecord) {
      path = ctx.router.url('vote_patterns.update', { id: votePattern.id });
    }
  }
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
    patternComments,
    patternsPath: ctx.router.url('patterns.list'),
    editPatternPath: ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: ctx.router.url('patterns.delete', { id: pattern.id }),
    votePatternPath: path,
    submitCommentPath: ctx.router.url('comments.create'),
    editCommentPath: (c) => ctx.router.url('comments.edit', { id: c.id }),
    deleteCommentPath: (c) => ctx.router.url('comments.delete', { id: c.id }),
  });
});

module.exports = router;
