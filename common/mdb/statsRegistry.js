var db = require('./dataBase').db;
const stats = db.collection("stats");

var getStat = exports.getStat = function(id, callback) {
    "use strict";

    stats.findOne({
        _id: db.ObjectId(id)
    }, function(err, stat) {
        if (stat === undefined) {
            console.log('Stat ', id, ' not found');
        }
        if (callback !== undefined) {
            callback(stat);
        }
    });
};

var hasStat = exports.hasStat = function(id, callback) {
    "use strict";

    getStat(id, function(stat) {
        if (stat === undefined) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

exports.addStat = function(stat, callback) {
    "use strict";

    stats.insertOne(stat, function(error, saved) {
        if (error) console.log('MongoDB: Error adding stat: ', error);
        if (callback !== undefined) {
            callback(saved);
        }

    });
};

/*
 * Removes a determined room from the data base.
 */
var removeStat = exports.removeStat = function(id, callback) {
    "use strict";

    hasStat(id, function(hasStat) {
        if (hasStat) {
            stats.deleteMany({
                _id: db.ObjectId(id)
            }, function(error, removed) {
                if (error) console.log('MongoDB: Error removing stat: ', error);
                callback(success);
            });
        }
    });
};

exports.removeStatsByRoom = function(roomId, callback) {

    stats.find({
        room: roomId
    }).toArray(function(err, stats) {
        if (err || !stats) {
            console.log("There are no stats for room " + roomId);
        } else {
            for (var i in stats) {
                removeStat(stats[i]._id);
            }

            callback(stats);
        }
    })
};

//Ahora mismo devuelve las stats del propio publisher y de sus subscribers
exports.getStatsByPublisher = function(pubId, callback) {
    stats.find({
        pub: pubId
    }).toArray(function(err, stats) {
        if (err || !stats) {
            console.log("There are no stats for this publisher")
        } else {

            callback(stats);

        }
    });
}

// subId es un USER, no un stream
exports.getStatsBySubscriber = function(subId, callback) {
    stats.find({
        subs: subId
    }).toArray(function(err, stats) {
        if (err || !stats) {
            console.log("There are no stats for this subscriber")
        } else {

            callback(stats);

        }
    });
}

exports.getStats = function(callback) {
    stats.find({}).toArray(function(err, stats) {
        if (err || !stats) {
            console.log("There are no stats")
        } else {

            callback(stats);

        }
    });
}


exports.getStatsBySubsAndPub = function(pubId, subId, callback) {
    stats.find({
        subs: subId,
        pub: pubId
    }).toArray(function(err, stats) {
        if (err || !stats) {
            console.log("There are no stats for this subscriber and publisher")
        } else {

            callback(stats);

        }
    });
}

exports.getStatsByDate = function(timestampInit, timestampFinal, callback) {

    if (timestampInit && timestampFinal) {
        stats.find({
            timestamp: {
                $gt: timestampInit,
                $lt: timestampFinal
            }
        }).toArray(function(err, stats) {
            if (err || !stats) {
                console.log("There are no stats on this date");
            } else {

                callback(stats);

            }
        })
    } else if (timestampInit && !timestampFinal) {
        stats.find({
            timestamp: {
                $gt: timestampInit
            }
        }).toArray(function(err, stats) {
            if (err || !stats) {
                console.log("There are no stats on this date");
            } else {

                callback(stats);

            }
        })
    } else if (timestampFinal && !timestampInit) {
        stats.find({
            timestamp: {
                $lt: timestampFinal
            }
        }).toArray(function(err, stats) {
            if (err || !stats) {
                console.log("There are no stats on this date");
            } else {

                callback(stats);

            }
        })
    }
};

exports.removeAllStats = function() {

    stats.deleteMany();
};
