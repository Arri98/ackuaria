const treeRegistry = require('./../common/mdb/treeRegistry');

exports.getSubDelay = async (req,res,next) => {
    const id = req.params.subId;
    const data = await treeRegistry.getQueueDelay(id);
    res.json({data: data});
};

exports.getNodeDelay = async (req,res,next) => {
    const treeId = req.params.treeId;
    const data = await treeRegistry.getNodeCreationDelay(treeId);
    console.log(data);
    res.json({data: data});
};

exports.getAllTreeEvents = async (req,res,next) => {
    const id = req.params.treeId;
    const data = await treeRegistry.getAllEvents(id);
    res.json(data);
};
