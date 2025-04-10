const express = require('express');
const router = express.Router();

// ✅ Use the correct controller function from inventoryController
const { getVisitorPurchases } = require('../controllers/inventoryController');

router.get('/:visitorId', getVisitorPurchases);  // <- visitorId is the param you use in Profile.jsx

module.exports = router;
