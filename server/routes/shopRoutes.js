const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/:userId', shopController.getUserShopPurchases);

module.exports = router;