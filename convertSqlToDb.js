const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');

const db = new sqlite3.Database('output.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS your_table (id INTEGER, name TEXT, value TEXT)');

  const stmt = db.prepare('INSERT INTO your_table VALUES (?, ?, ?)');
  fs.createReadStream('./database/colab.csv')
    .pipe(csv())
    .on('data', (row) => {
      stmt.run(row.id, row.name, row.value);
    })
    .on('end', () => {
      stmt.finalize();
      console.log('CSV file successfully processed');
    });
});

db.close();
