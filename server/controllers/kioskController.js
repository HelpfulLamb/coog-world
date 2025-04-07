const kioskModel = require('../models/kioskModel.js');

exports.createKiosk = async (req, res) => {
    try {
        const {Kiosk_name, Kiosk_type, Kiosk_cost, Kiosk_loc, Staff_num} = req.body;
        const kioskId = await kioskModel.createKiosk({Kiosk_name, Kiosk_type, Kiosk_cost, Kiosk_loc, Staff_num});
        res.status(201).json({id: kioskId, Kiosk_name, Kiosk_type, Kiosk_cost, Kiosk_loc, Staff_num});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateKiosk = async (req, res) => {
    try {
        const kioskID = req.params.id;
        const updatedData = req.body;
        const selectedKiosk = {...updatedData, Kiosk_ID: kioskID};
        const updatedKiosk = await kioskModel.updateKiosk(selectedKiosk);
        if(!updatedKiosk){
            return res.status(404).json({message: 'Kiosk not found or not updated.'});
        }
        res.status(200).json({message: 'Kiosk updated successfully.', kiosk: updatedData});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllKiosks = async (req, res) => {
    try {
        const kiosks = await kioskModel.getAllKiosks();
        res.status(200).json(kiosks);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getKioskInfo = async (req, res) => {
    try {
        const kiosks = await kioskModel.getKioskInfo();
        res.status(200).json(kiosks);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllMerchShops = async (req, res) => {
    try {
        const shops = await kioskModel.getAllMerchShops();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllBooths = async (req, res) => {
    try {
        const booths = await kioskModel.getAllBooths();
        res.status(200).json(booths);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllFoodShops = async (req, res) => {
    try {
        const food = await kioskModel.getAllFoodShops();
        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getKioskById = async (req, res) => {
    try {
        const kiosk = await kioskModel.getKioskById(req.params.id);
        if(!kiosk){
            return res.status(404).json({message: 'Kiosk not found'});
        }
        res.status(200).json(kiosk);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllKiosks = async (req, res) => {
    try {
        await kioskModel.deleteAllKiosks();
        res.status(200).json({message: 'All kiosks deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteKioskById = async (req, res) => {
    try {
        const {Kiosk_ID} = req.body;
        if(!Kiosk_ID){
            return res.status(400).json({message: 'Invalid kiosk ID.'});
        }
        await kioskModel.deleteKioskById(Kiosk_ID);
        res.status(200).json({message: 'Kiosk deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};