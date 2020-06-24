const { stdout } = globalThis.process;


async function applyMigrationStep(name, step, options) {
  const  { connection } = options;
  const { title, source } = step;
  const startInfo = `${name} ${title}`.padEnd(64, '.');
  let error = null;
  try {
    await connection.execute(source);
  } catch(err) {
    error = err;
  }

  const endInfo = `${error ? 'ERROR' : 'OK'}`.padStart(5, '.');
  stdout.write(`${startInfo}${endInfo}\n`);
  if(error) {
    throw error;
  }
}

async function applyMigrationSteps(name, steps, options) {
  for(const step of steps) {
    await applyMigrationStep(name, step, options);
  }
}

async function applyMigration(migration, options) {
  const { name, config } = migration;
  const { main, after, before, env } = config;
  await applyMigrationSteps(name, main, options);
  await applyMigrationSteps(name, after, options);
  await applyMigrationSteps(name, before, options);
  await applyMigrationSteps(name, env, options);
  const { stats: { id, revision, hash, version } } = config;
  const { connection } = options;
  const sql = 'INSERT INTO whoa (`id`, `revision`, `version`, `hash`) VALUES (?, ?, ?, ?)';
  await connection.execute(sql, [ id, revision, hash, version ]);
};


export default async function applyMigrations(migrations, options) {
  if(!migrations.length) {
    console.log('Database is up-to-date. No changes needed');
    return;
  }
  stdout.write(`Apply some database migrations (${migrations.length}):\n`);
  for(const migration of migrations) {
    await applyMigration(migration, options);
  }
};
