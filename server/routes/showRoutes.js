const showController = require('../controllers/showController.js');
const express = require('express');
const showRouter = express.Router();

// create new shows
showRouter.post('/create-show', showController.createShow);
showRouter.post('/log', showController.logVisitorShow);

// For show report
showRouter.post('/top-shows', showController.getTopShows);

// update existing show
showRouter.put('/:id', showController.updateShow);

// retrieve shows (all or specific)
showRouter.get('/', showController.getAllShows);
showRouter.get('/user-view', showController.getShowForCard);
showRouter.get('/info', showController.getShowInfo);
showRouter.get('/today-show', showController.getPopularShowToday);
showRouter.get('/history/:id', showController.getVisitorShowHistory);
showRouter.get('/:id', showController.getShowById);

// delete shows (all or specific)
showRouter.delete('/delete-all', showController.deleteAllShows);
showRouter.delete('/delete-selected', showController.deleteShowById);


module.exports = {
    showRouter
}