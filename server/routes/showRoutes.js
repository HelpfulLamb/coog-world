const showController = require('../controllers/showController.js');
const express = require('express');
const showRouter = express.Router();

// create new shows
showRouter.post('/', showController.createShow);

// retrieve shows (all or specific)
showRouter.get('/', showController.getAllShows);
showRouter.get('/:id', showController.getShowById);

// delete shows (all or specific)
showRouter.delete('/', showController.deleteAllShows);
showRouter.delete('/:id', showController.deleteShowById);


module.exports = {
    showRouter
}