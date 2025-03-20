const boothModel = require('../models/boothModel.js');

exports.createBooth = async (req, res) => {
    try {
        const {name, location, start_time, end_time, cost, revenue, staffers, status} = req.body;
        const boothId = await boothModel.createBooth(name, location, start_time, end_time, cost, revenue, staffers, status);
        res.status(201).json({id: boothId, name, location, start_time, end_time, cost, revenue, staffers, status});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllBooths = async (req, res) => {
    try {
        const booths = await boothModel.getAllBooths();
        res.status(200).json(booths);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getBoothById = async (req, res) => {
    try {
        const booth = await boothModel.getBoothById(req.params.id);
        if(!booth){
            return res.status(404).json({message: 'Booth not found'});
        }
        res.status(200).json(booth);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllBooths = async (req, res) => {
    try {
        await boothModel.deleteAllBooths();
        res.status(200).json({message: 'All booths deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteBoothById = async (req, res) => {
    try {
        await boothModel.deleteBoothById(req.params.id);
        res.status(200).json({message: 'Booth deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};