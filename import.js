const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('currencyWar');

    // Clear existing data
    await collection.deleteMany({});

    const characterDir = path.join(__dirname, 'currencyWar', 'character');

    function readJsonFiles(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          readJsonFiles(filePath);
        } else if (file.endsWith('.json')) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          collection.insertOne(data);
          console.log(`Imported ${file}`);
        }
      }
    }

    readJsonFiles(characterDir);
    console.log('Import completed');
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

importData();