const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular pattern
async function loadPattern(ctx, next) {
  ctx.state.pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  ctx.state.access = 'protected';
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

// Searches for patterns
async function searchPatterns(ctx, next) {
  const params = ctx.request.query;
  ctx.state.materials = await ctx.orm.material.findAll();
  ctx.state.categories = await ctx.orm.category.findAll();
  let patterns = [];
  if (params.name) {
    patterns = await ctx.orm.pattern.findAll({
      where: { name: { [ctx.orm.Sequelize.Op.iLike]: `%${params.name}%` } },
    });
  }
  if ((params.category === 'all') || !params.category) {
    if (!params.name) {
      patterns = await ctx.orm.pattern.findAll();
    }
  } else if (!params.name) {
    patterns = await ctx.orm.pattern.findAll({
      where: { categoryId: params.category },
    });
  } else {
    patterns = patterns.filter((pattern) => pattern.categoryId.toString() === params.category);
  }
  ctx.state.patternsList = patterns;
  if (params.materials) {
    ctx.state.patternsList = [];
    if (typeof (params.materials) === 'string') {
      params.materials = [params.materials];
    }
    const asyncMaterials = [];
    patterns.forEach((pattern) => asyncMaterials.push(pattern.getMaterials()));
    const patternMaterials = await Promise.all(asyncMaterials);
    patterns.forEach((pattern) => {
      const searchMaterials = params.materials;
      let materials = patternMaterials.shift();
      materials = materials.map((material) => material.id.toString());
      if (!searchMaterials.filter((x) => !materials.includes(x)).length) {
        ctx.state.patternsList.push(pattern);
      }
    });
  }
  if (params.sorting === 'popular') {
    ctx.state.patternsList.sort((a, b) => a.score - b.score).reverse();
  } else {
    ctx.state.patternsList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  }
  return next();
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  const current = ctx.state.currentUser;
  if (ctx.state.access === 'protected') {
    if ((current) && ((current.role === 'admin') || (current.id === ctx.state.pattern.authorId))) {
      return next();
    }
  } else if (current) {
    return next();
  }
  ctx.redirect(ctx.router.url('patterns.list'));
  return 'Unauthorized Access!';
}

router.get('patterns.list', '/', searchPatterns, async (ctx) => {
  const {
    patternsList, materials, categories,
  } = ctx.state;
  await ctx.render('patterns/index', {
    materials,
    categories,
    patternsList,
    patternsPath: ctx.router.url('patterns.list'),
    newPatternPath: ctx.router.url('patterns.new'),
    patternPath: (pattern) => ctx.router.url('patterns.show', { id: pattern.id }),
    editPatternPath: (pattern) => ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: (pattern) => ctx.router.url('patterns.delete', { id: pattern.id }),
  });
});

router.get('patterns.new', '/new', authenticate, async (ctx) => {
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

router.get('patterns.edit', '/:id/edit', loadPattern, authenticate, async (ctx) => {
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

router.post('patterns.create', '/', authenticate, async (ctx) => {
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

router.patch('patterns.update', '/:id', loadPattern, authenticate, async (ctx) => {
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

router.del('patterns.delete', '/:id', loadPattern, authenticate, async (ctx) => {
  if (ctx.state.currentUser) {
    const { pattern } = ctx.state;
    await pattern.destroy();
  }
  ctx.redirect(ctx.router.url('patterns.list'));
});

router.get('patterns.show', '/:id', loadPattern, async (ctx) => {
  const { pattern } = ctx.state;
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
