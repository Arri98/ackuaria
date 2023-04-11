var db = require('./dataBase').db;
const events = db.collection("events");

console.log(events);

var getEvent = exports.getEvent = function(id, callback) {
    "use strict";

    events.findOne({
        _id: db.ObjectId(id)
    }, function(err, event) {
        if (event === undefined) {
            console.log('Event ', id, ' not found');
        }
        if (callback !== undefined) {
            callback(event);
        }
    });
};

var hasEvent = exports.hasEvent = function(id, callback) {
    "use strict";

    getEvent(id, function(event) {
        if (event === undefined) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

exports.addEvent = function(event, callback) {
    "use strict";
    console.log('add events');
    events.insertOne(event, function(error, saved) {
        if (error) console.log('MongoDB: Error adding event: ', error);
        if (callback !== undefined) {
            callback(saved);
        }
    });
};

/*
 * Removes a determined room from the data base.
 */
var removeEvent = exports.removeEvent = function(id, callback) {
    "use strict";

    hasEvent(id, function(hasEvent) {
        if (hasEvent) {
            events.deleteMany({
                _id: db.ObjectId(id)
            }, function(error, removed) {
                if (error) console.log('MongoDB: Error removing event: ', error);
                callback("yes");
            });
        }
    });
};

exports.removeEventsByRoom = function(roomId, callback) {

    events.find({
        room: roomId
    }).toArray(function(err, events) {
        if (err || !events) {
            console.log("There are no events for room " + roomId);
        } else {
            for (var i in events) {
                removeEvent(events[i]._id, function(removed) {
                    console.log(removed);
                });
            }

            callback("Removed all events in room " + roomId);
        }
    })
};

exports.getEvents = function(callback) {
    events.find({}).toArray(function(err, events) {
        if (err) {
            console.log("Error: " + err);
        } else {
            callback(events);
        }
    });
};

exports.getEventsOfRoom = function(roomId, callback) {
    events.find({
        room: roomId
    }).toArray(function(err, events) {
        if (err || !events) {
            console.log("There are no events for room " + roomId);
        } else {
            callback(events);
        }
    })
};

exports.getEventsOfUser = function(userId, callback) {
    events.find({
        user: userId
    }).toArray(function(err, events) {
        if (err || !events) {
            console.log("There are no events for user " + userId);
        } else {
            callback(events);
        }
    })
};

exports.getEventsOfType = function(type, callback) {
    events.find({
        type: type
    }).toArray(function(err, events) {
        if (err || !events) {
            console.log("There are no events of type " + type);
        } else {
            callback(events);
        }
    })
};

exports.getEventsByDate = function(timestampInit, timestampFinal, callback) {

    if (timestampInit && timestampFinal) {

        events.find({
            timestamp: {
                $gt: timestampInit,
                $lt: timestampFinal
            }
        }).toArray(function(err, events) {
            if (err || !events) {
                console.log("There are no events on this date ");
            } else {
                callback(events);
            }
        })

    } else if (timestampInit && !timestampFinal) {

        events.find({
            timestamp: {
                $gt: timestampInit
            }
        }).toArray(function(err, events) {
            if (err || !events) {
                console.log("There are no events on this date");
            } else {

                callback(events);

            }
        })

    } else if (timestampFinal && !timestampinit) {

        events.find({
            timestamp: {
                $lt: timestampFinal
            }
        }).toArray(function(err, events) {
            if (err || !events) {
                console.log("There are no events on this date");
            } else {

                callback(events);

            }
        })
    }
};



exports.getEventsByDateAndType = function(timestampInit, timestampFinal, type, callback) {

    if (timestampInit && timestampFinal) {

        events.find({
            timestamp: {
                $gt: timestampInit,
                $lt: timestampFinal
            },
            type: type
        }).toArray(function(err, events) {
            if (err || !events) {
                console.log("There are no events on this date ");
            } else {
                callback(events);
            }
        })

    } else if (timestampInit && !timestampFinal) {

        events.find({
            timestamp: {
                $gt: timestampInit
            }
        }).toArray(function(err, events) {
            if (err || !events) {
                console.log("There are no events on this date");
            } else {

                callback(events);

            }
        })

    } else if (timestampFinal && !timestampinit) {

        events.find({
            timestamp: {
                $lt: timestampFinal
            }
        }).toArray(function(err, events) {
            if (err || !events) {
                console.log("There are no events on this date");
            } else {

                callback(events);

            }
        })
    }
};

exports.removeAllEvents = function() {

    events.deleteMany();
    //callback("All events removed succesfully");

};
