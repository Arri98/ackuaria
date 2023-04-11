var db = require('./dataBase').db;
const sessions = db.collection("sessions")

var getSession = exports.getSession = function(id, callback) {
	"use strict";

	sessions.findOne({
		_id: db.ObjectId(id)
	}, function(err, session) {
		if (session === undefined) {
			console.log('Session ', id, ' not found');
		}
		if (callback !== undefined) {
			callback(room);
		}
	});
};

var hasSession = exports.hasSession = function(id, callback) {
	"use strict";

	getSession(id, function(session) {
		if (session === undefined) {
			callback(false);
		} else {
			callback(true);
		}
	});
};

exports.addSession = function(session, callback) {
	"use strict";

	sessions.insertOne(session, function(error, saved) {
		if (error) console.log('MongoDB: Error adding session: ', error);
		if (callback !== undefined) {
			callback(saved);
		}
	});
};


exports.getSessions = function(callback) {

    sessions.find({}).toArray(function(err, sessions) {
        if (err || !sessions) {
        	callback([]);
            console.log("There are no sessions ");
        } else {
			console.log(sessions);
            callback(sessions);
        }
    });
}

exports.getSessionsOfRoom = function(roomID, callback) {

    sessions.find({roomID: roomID}).toArray(function(err, sessions) {
        if (err || !sessions) {
         	callback([]);
            console.log("There are no sessions ");
        } else {
            callback(sessions);
        }
    });
}

exports.getSessionsOfUser = function(userID, callback) {
	var sessions = [];
    sessions.find().forEach(function(err, doc) {
    	if (!doc) callback(sessions);
    	else {
    		var streams = doc.streams;
    		for (var s in streams) {
    			if (streams[s].userID == userID) {
    				sessions.push(doc);
    				break;
    			}

    		}
    	}
    })
}

exports.getSessionsOfStream = function(streamID, callback) {
	var sessions = [];
    sessions.find().forEach(function(err, doc) {
    	if (!doc) callback(sessions);
    	else {
    		var streams = doc.streams;
    		for (var s in streams) {
    			if (streams[s].streamID == streamID) {
    				sessions.push(doc);
    				break;
    			}

    		}
    	}
    })
}







exports.getSessionsBySessionId = function(sessionId, callback) {

    sessions.find({sessionId: sessionId}).toArray(function(err, sessions) {
        if (err || !sessions) {
            console.log("There are no sessions ");
        } else {
            callback(sessions);
        }
    });
}


exports.getPublishersInSession = function(sessionId, callback) {

    sessions.findOne({
        sessiomId: sessionId
    }, function(err, session) {
        if (session) {
            callback(session.publishers);
        }
        if (err) {
            callback(err);
        }
    })
}

exports.removeAllSessions = function() {

    sessions.deleteMany();
}

//getSessionByDate
//getSessionTimestamps
//getNumberOfSession
