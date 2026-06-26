const mongoose = require('mongoose');

(async () => {
  const uri = 'mongodb://127.0.0.1:27017/lyracode';
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const cols = await db.listCollections().toArray();
    console.log('DATABASE:', db.databaseName);
    console.log('COLLECTIONS:');
    for (const c of cols) {
      const count = await db.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${count}`);
    }
    const users = await db.collection('users').find().limit(5).toArray();
    console.log('SAMPLE USERS:', users);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await mongoose.disconnect();
  }
})();

