const maintenanceModel = require('../models/maintenanceModel.js');

exports.createMaintenance = async (req, res) => {
    try {
        const {maint_date, cost, repair_date, type, objective, num} = req.body;
        const maintenanceId = await maintenanceModel.createMaintenance(maint_date, cost, repair_date, type, objective, num);
        res.status(201).json({id: maintenanceId, maint_date, cost, repair_date, type, objective, num});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllMaintenance = async (req, res) => {
    try {
        const maintenance = await maintenanceModel.getAllMaintenance();
        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await maintenanceModel.getMaintenanceById(req.params.id);
        if(!maintenance){
            return res.status(404).json({message: 'Maintenance not found'});
        }
        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllMaintenance = async (req, res) => {
    try {
        await maintenanceModel.deleteAllMaintenance();
        res.status(200).json({message: 'All maintenance deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteMaintenanceById = async (req, res) => {
    try {
        await maintenanceModel.deleteMaintenanceById(req.params.id);
        res.status(200).json({message: 'Maintenance deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};