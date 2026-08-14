const { MongoMemoryReplSet } = require('mongodb-memory-server');

async function startMongo() {
  console.log('Starting local embedded MongoDB Replica Set on port 27017...');
  try {
    const replSet = await MongoMemoryReplSet.create({
      instanceOpts: [
        {
          port: 27017,
        },
      ],
      replSet: {
        name: 'rs0',
        count: 1,
        storageEngine: 'wiredTiger',
      },
    });

    const uri = replSet.getUri();
    console.log('MongoDB Replica Set started successfully!');
    console.log('Connection URI:', uri);
    console.log('Ready for Next.js ATS hackathon application with Prisma transactions!');

    process.on('SIGINT', async () => {
      await replSet.stop();
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start local MongoDB Replica Set:', err);
    process.exit(1);
  }
}

startMongo();
