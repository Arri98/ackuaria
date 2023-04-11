var db = require('./dataBase').db;
const rooms = db.collection("rooms");

exports.hasRoom= function(roomID, callback) {
    "use strict";
    rooms.findOne({
        roomID: roomID
    }, function(err, room) {
        if (room === null) {
            callback(false);
        } else {
            callback(true);
        }
    });
};


exports.getRoom = function(roomID, callback) {
    "use strict";

    rooms.findOne({
        roomID: roomID
    }, function(err, room) {
        if (room === undefined) {
            console.log('Room ', roomID, ' not found');
        }
        if (callback !== undefined) {
            callback(room);
        }
    });
};

exports.getRoomsData = function (roomsArray, callback) {
    rooms.find({
        roomID : { $in : roomsArray }
    }, function(err, roomList) {
        if (roomList === undefined) {
            console.log('Rooms not found');
        }
        if (callback !== undefined) {
            callback(roomList);
        }    } );
}


exports.addRoom = function(room, callback) {
    "use strict";
    console.log('addRoom');
    rooms.insertOne(room, function(error, saved) {
        if (error) console.log('MongoDB: Error adding room: ', error);
        if (callback !== undefined) {
            callback(saved);
        }
    });
};

exports.updateRoomPublish = function(roomId, pubId, callback) {
    var pubs = [];
    var nPubs;

    rooms.findOne({
        roomId: roomId
    }, function(err, room) {
        if (room) {

            pubs = room.publishers;
            nPubs = room.nPubs;
            nPubs++;
            pubs.push(pubId);

            rooms.update({
                roomId: roomId
            }, {
                $set: {
                    publishers: pubs,
                    nPubs: nPubs
                }
            }, function(err, result) {
                if (err)
                    callback("Couldn't update room info");

                else
                    callback("Added publisher to room info");
            })
        } else console.log(err);
    })
}


exports.updateRoomUnpublish = function(roomId, pubId, callback) {

    rooms.findOne({
        roomId: roomId
    }, function(err, room) {
        if (room) {

            nPubs = room.nPubs;
            nPubs--;

            rooms.update({
                roomId: roomId
            }, {
                $set: {
                    nPubs: nPubs
                }
            }, function(err, result) {
                if (err)
                    callback("Couldn't update room info");

                else {
                    if (nPubs == 0) {
                        callback("One publisher less in room info", true);

                    } else callback("One publisher less in room info", false);
                }
            })
        } else console.log(err);
    })
}



exports.updateRoomSession = function(roomId, nSession, callback) {

    rooms.findOne({
        roomId: roomId
    }, function(err, room) {
        if (room) {

            rooms.update({
                roomId: roomId
            }, {
                $set: {
                    nSession: nSession
                }
            }, function(err, result) {
                if (err)
                    callback("Couldn't add session to room " + roomId);
                else
                    callback("Added session to room " + roomId);
            })
        } else console.log(err);
    })
}

exports.getRooms = function(callback) {

    rooms.find({}).toArray(function(err, rooms) {
        if (err || !rooms) {
            console.log("There are no rooms ");
        } else {
            callback(rooms);
        }
    });
}

// Devuelve un array con todos los publishers de una room
exports.getPublishersInRoom = function(roomId, callback) {
    console.log('getPublishersInRoom');
    rooms.findOne({
        roomId: roomId
    }, function(err, room) {
        if (room) {
            callback(room.publishers);
        }
        if (err) {
            callback(err);
        }
    })
}

// Devuelve un array con todos los publishers
exports.getPublishers = function(callback) {
    console.log('getPublishers')
    var a = [];
    rooms.find({}, function(err, rooms) {
        for (room in rooms){
            a = a.concat(rooms[room].publishers);
        }
        callback(a);
    })


}
exports.getTotalRooms = function(callback) {
    var a = [];
    rooms.find({}, function(err, rooms) {
        if (err){
            callback(err);
        }

        if (rooms){
            var total = 0;
            for (room in rooms){
                total++;
            }
            callback(total);
        }
        else {
                    callback("There are no rooms");

        }

    })


}

exports.removeAllRooms = function() {

    rooms.deleteMany();
}
