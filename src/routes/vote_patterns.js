const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadVote_pattern(ctx, next) {
  ctx.state.vote_pattern = await ctx.orm.vote_pattern.findByPk(ctx.params.id);
  return next();
}

// Editado
router.get('vote_patterns.list', '/', async (ctx) => {
  const vote_patternsList = await ctx.orm.vote_pattern.findAll();
  const patternsList = await ctx.orm.pattern.findAll();
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('vote_patterns/index', {
    vote_patternsList,
    patternsList,
    usersList,
    newVote_patternPath: ctx.router.url('vote_patterns.new'),
    votes_patternPath: (vote_pattern) => ctx.router.url('vote_patterns.show', { id: vote_pattern.id }),
    editVote_patternPath: (vote_pattern) => ctx.router.url('vote_patterns.edit', { id: vote_pattern.id }),
    deleteVote_patternPath: (vote_pattern) => ctx.router.url('vote_patterns.delete', { id: vote_pattern.id }),
  });
});

router.get('vote_patterns.new', '/new', async (ctx) => {
  const vote_pattern = ctx.orm.vote_pattern.build();
  const usersList = await ctx.orm.user.findAll();
  const patternsList = await ctx.orm.pattern.findAll();
  const options = [1, 2, 3, 4, 5];
  await ctx.render('vote_patterns/new', {
    vote_pattern,
    usersList,
    options,
    patternsList,
    vote_patternsPath: ctx.router.url('vote_patterns.list'),
    submitVote_patternPath: ctx.router.url('vote_patterns.create'),
  });
});


router.get('vote_patterns.edit', '/:id/edit', loadVote_pattern, async (ctx) => {
  const { vote_pattern } = ctx.state;
  const usersList = await ctx.orm.user.findAll();
  const patternsList = await ctx.orm.pattern.findAll();
  const options = [1, 2, 3, 4, 5];
  await ctx.render('vote_patterns/edit', {
    vote_pattern,
    usersList,
    patternsList,
    options,
    vote_patternsPath: ctx.router.url('vote_patterns.list'),
    submitVote_patternPath: ctx.router.url('vote_patterns.update', { id: vote_pattern.id }),
  });
});


router.post('vote_patterns.create', '/', async (ctx) => {
  const votesList = await ctx.orm.vote_pattern.findAll();
  const values = ctx.request.body;
  const pattern = await ctx.orm.pattern.findByPk(values['patternId']);
  const votes_pattern = await pattern.getVote_patterns();
  const array = [0];
  const vote_change = {};
  votes_pattern.forEach( vote => {
    if (vote['userId'] == values['userId']){
      array[0] = 1;
      vote_change['vote'] = vote;
    }
  });

  if (!array[0]) {
  const vote_pattern = ctx.orm.vote_pattern.build(ctx.request.body);
  try {
      await vote_pattern.save({ fields: ['patternId', 'userId', 'rating'] });
      ctx.redirect(ctx.router.url('patterns.show', { id: vote_pattern.patternId }));
    }
    catch (validationError) {
      await ctx.render('vote_patterns/new', {
        vote_pattern,
        errors: validationError.errors,
        submitVote_patternPath: ctx.router.url('vote_patterns.create'),
      });
    }
  }
  else {
    const vote = vote_change['vote'];
    const {
      patternId, userId, rating,
    } = ctx.request.body;
    await vote.update({
      patternId, userId, rating,
    });
    ctx.redirect(ctx.router.url('patterns.show', { id: vote.patternId }));
  }
  });

router.patch('vote_patterns.update', '/:id', loadVote_pattern, async (ctx) => {
  const { vote_pattern } = ctx.state;
  try {
    const {
      patternId, userId, rating,
    } = ctx.request.body;
    await vote_pattern.update({
      patternId, userId, rating,
    });

    ctx.redirect(ctx.router.url('vote_patterns.list'));
  } catch (validationError) {
    await ctx.render('vote_patterns/edit', {
      vote_pattern,
      errors: validationError.errors,
      submitVote_patternPath: ctx.router.url('vote_patterns.update'),
    });
  }
});

router.del('vote_patterns.delete', '/:id', loadVote_pattern, async (ctx) => {
  const { vote_pattern } = ctx.state;
  await vote_pattern.destroy();
  ctx.redirect(ctx.router.url('vote_patterns.list'));
});

module.exports = router;
