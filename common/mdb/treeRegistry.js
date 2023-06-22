const db = require('./dataBase').db;
const trees = db.collection("trees");
const levels = db.collection("levels");
const enqueues = db.collection("enqueues");
const nodeRequests = db.collection("nodeRequests");
const nodes = db.collection("nodes");
const subscribers = db.collection("subscribers");
const erizos = db.collection("erizos");
const agent = db.collection("agents");

const getTree = exports.getTree = function(id, callback) {
    "use strict";

    trees.findOne({
        _id: db.ObjectId(id)
    }, function(err, tree) {
        if (tree === undefined) {
            console.log('Tree ', id, ' not found');
        }
        if (callback !== undefined) {
            callback(tree);
        }
    });
};

const hasTree = exports.hasTree = function(id, callback) {
    "use strict";

    getTree(id, function(tree) {
        if (tree === undefined) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

exports.addTree = function(tree, callback) {
    "use strict";

    trees.insertOne(tree, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding tree: ', error);
        }
        if (callback !== undefined) {
            callback(saved);
        }

    });
};

exports.needNode = function(node, callback) {
    "use strict";

    nodeRequests.insertOne(node, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding node request: ', error);
        }
        if (callback !== undefined) {
            callback(saved);
        }

    });
};

/*
 * Removes a determined room from the data base.
 */
const removeTree = exports.removeTree = function(id, callback) {
    "use strict";

    hasTree(id, function(hasTree) {
        if (hasTree) {
            trees.deleteMany({
                _id: db.ObjectId(id)
            }, function(error, removed) {
                if (error) {
                    console.log('MongoDB: Error removing tree: ', error);
                }
                callback(success);
            });
        }
    });
};


exports.addNode = function(node, callback) {
    "use strict";

    nodes.insertOne(node, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding node: ', error);
        }
        if (callback !== undefined) {
            callback(saved);
        }

    });
};


exports.enqueueSusbscriber = function(enqueue, callback) {
    "use strict";

    enqueues.insertOne(enqueue, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding enqueue: ', error);
        }
        if (callback !== undefined) {
            callback(saved);
        }

    });
};

exports.addLevel = function(level, callback) {
    "use strict";

    levels.insertOne(level, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding level: ', error);
        }
        if (callback !== undefined) {
            callback(saved);
        }
    });
};

exports.addErizo = function(erizo, callback) {
    "use strict";

    erizos.insertOne({erizo}, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding erizo: ', error);
        }
        if (callback !== undefined) {
            callback(saved);
        }
    });
};

exports.addAgent = function(cpu, callback) {
    "use strict";

    agent.insertOne(cpu, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding sub: ', error);
        }
        if (callback !== undefined) {
            callback(saved);
        }
    });
};


exports.addSubscriber = function(sub, callback) {
    "use strict";

    subscribers.insertOne(sub, function(error, saved) {
        if (error){
            console.log('MongoDB: Error adding sub: ', error);
        }
        if (callback !== undefined) {
            callback(saved);
        }
    });
};

exports.getQueueDelay = async(id) => {
    const enter = await enqueues.findOne({_id:id});
    const exit = await subscribers.findOne({_id:id});
    console.log(enter, exit);
    return exit.timestamp - enter.timestamp;

};

exports.getNodeCreationDelay = async (treeId) => {
    const enters = await nodeRequests.find({'treeId': Number(treeId)}).sort({'timestamp': 1}).toArray();
    const exits = await nodes.find({'treeId': Number(treeId)}).sort({'timestamp': 1}).toArray();
    const delays = [];
    exits.splice(0, 1); //EL nodo 0 no se pide

    const length = enters.length > exits.length ? exits.length : enters.length;

    for(let i = 0; i < length; i++){
        delays.push(exits[i].timestamp - enters[i].timestamp);
    }

    if(enters.length !== exits.length){
        const difference = Math.abs(enters.length - exits.length);
        delays.push(`${difference} nodes were not created`);

    }
    return delays;
};

exports.getAllEvents = async (treeId) => {
    console.log(treeId);
    return {
        enqueues: await enqueues.find({treeId: Number(treeId)}).toArray(),
        nodes:    await nodes.find({treeId: Number(treeId)}).toArray(),
        subscribers:    await subscribers.find({treeId: Number(treeId)}).toArray(),
        levels:    await levels.find({treeId: Number(treeId)}).toArray(),
        nodeRequests:    await nodeRequests.find({treeId: Number(treeId)}).toArray(),
        tree:    await trees.findOne({_id: Number(treeId)})
    };
};
