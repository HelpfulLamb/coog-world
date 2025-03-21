const serviceModel = require('../models/serviceModel.js');

exports.createService = async (req, res) => {
    try {
        const {type, cost, staffers, assigned_staffer, int_use} = req.body;
        const serviceId = await serviceModel.createService(type, cost, staffers, assigned_staffer, int_use);
        res.status(201).json({id: serviceId, type, cost, staffers, assigned_staffer, int_use});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await serviceModel.getAllServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await serviceModel.getServiceById(req.params.id);
        if(!service){
            return res.status(404).json({message: 'Service not found'});
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllServices = async (req, res) => {
    try {
        await serviceModel.deleteAllServices();
        res.status(200).json({message: 'All services deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteServiceById = async (req, res) => {
    try {
        await serviceModel.deleteServiceById(req.params.id);
        res.status(200).json({message: 'Service deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};