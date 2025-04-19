const kioskModel = require('../models/kioskModel.js');

exports.createKiosk = async (req, res, body) => {
    const {Kiosk_name, Kiosk_type, Kiosk_cost, Kiosk_loc, Staff_num} = body;
    if(!Kiosk_name || !Kiosk_type || !Kiosk_cost || !Kiosk_loc || !Staff_num){
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'All fields are required! Somethings missing.'}));
    }
    try {
        const existingKiosk = await kioskModel.findKioskByName(Kiosk_name);
        if(existingKiosk){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'A Kiosk with that name already exists. Please try again.'}));
        }
        await kioskModel.createKiosk({Kiosk_name, Kiosk_type, Kiosk_cost, Kiosk_loc, Staff_num});
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'New Kiosk Created Successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.updateKiosk = async (req, res, id, body) => {
    try {
        const updatedData = body;
        const selectedKiosk = {...updatedData, Kiosk_ID: id};
        const updatedKiosk = await kioskModel.updateKiosk(selectedKiosk);
        if(!updatedKiosk){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Kiosk not found or not updated.'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Kiosk updated successfully.', kiosk: updatedData}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getAllKiosks = async (req, res) => {
    try {
        const kiosks = await kioskModel.getAllKiosks();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(kiosks));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getKioskInfo = async (req, res) => {
    try {
        const kiosks = await kioskModel.getKioskInfo();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(kiosks));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getAllMerchShops = async (req, res) => {
    try {
        const shops = await kioskModel.getAllMerchShops();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(shops));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getAllBooths = async (req, res) => {
    try {
        const booths = await kioskModel.getAllBooths();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(booths));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getAllFoodShops = async (req, res) => {
    try {
        const food = await kioskModel.getAllFoodShops();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(food));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getKioskById = async (req, res, id) => {
    try {
        const kiosk = await kioskModel.getKioskById(id);
        if(!kiosk){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Kiosk not found'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(kiosk));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteAllKiosks = async (req, res) => {
    try {
        await kioskModel.deleteAllKiosks();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'All kiosks deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteKioskById = async (req, res, body) => {
    try {
        const {Kiosk_ID} = body;
        if(!Kiosk_ID){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Invalid kiosk ID.'}));
        }
        await kioskModel.deleteKioskById(Kiosk_ID);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Kiosk deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};