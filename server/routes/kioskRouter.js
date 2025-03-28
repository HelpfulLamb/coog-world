const kioskController = require('../controllers/kioskController.js');
const express = require('express');
const kioskRouter = express.Router();

// create new kiosks
// kioskRouter.post('/booth', kioskController.createBooth);
// kioskRouter.post('/shop', kioskController.createShop);
kioskRouter.post('/create-kiosk', kioskController.createKiosk);

// retrieve kiosks (all or specific)
kioskRouter.get('/', kioskController.getAllKiosks);
kioskRouter.get('/info', kioskController.getKioskInfo);
kioskRouter.get('/shops', kioskController.getAllMerchShops);
kioskRouter.get('/booths', kioskController.getAllBooths);
kioskRouter.get('/foods', kioskController.getAllFoodShops);
kioskRouter.get('/:id', kioskController.getKioskById);

// delete kiosks (all or specific)
kioskRouter.delete('/', kioskController.deleteAllKiosks);
kioskRouter.delete('/:id', kioskController.deleteKioskById);


module.exports = {
    kioskRouter
}