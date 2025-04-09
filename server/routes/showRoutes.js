const showController = require('../controllers/showController.js');
const express = require('express');
const showRouter = express.Router();

// create new shows
showRouter.post('/create-show', showController.createShow);

// update existing show
showRouter.put('/:id', showController.updateShow);

// retrieve shows (all or specific)
showRouter.get('/', showController.getAllShows);
showRouter.get('/user-view', showController.getShowForCard);
showRouter.get('/info', showController.getShowInfo);
showRouter.get('/:id', showController.getShowById);

// delete shows (all or specific)
showRouter.delete('/delete-all', showController.deleteAllShows);
showRouter.delete('/delete-selected', showController.deleteShowById);


module.exports = {
    showRouter
}