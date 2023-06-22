const fs = require('fs');
const id = process.argv.slice(2)[0];
const db = require('./common/mdb/dataBase').db;

const dockerStats = db.collection("dockerStats");
const file = fs.readFileSync('stats.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

const lines = file.split("-");

for (let i = 0; i < lines.length -1 ; i++){
    const line = lines[i].split("|")[0];
    const timestamp = lines[i].split("|")[1];
    const stat = JSON.parse(line);
    stat.timestamp = timestamp;
    console.log(stat);
    stat.sessionId = id || 1;
    dockerStats.insertOne(stat, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding tree: ', error);
        }
    });
}


