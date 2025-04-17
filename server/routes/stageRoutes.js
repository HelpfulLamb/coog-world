const express = require('express');
const stageRouter = express.Router();
const stageController = require('../controllers/stageController.js');

// Route to fetch all stages
stageRouter.get('/all', stageController.getStages);

// Route to add a new stage
stageRouter.post('/add', stageController.addStage);

// Route to update an existing stage
stageRouter.put('/update/:id', stageController.updateStage);

stageRouter.delete('/delete/:id', stageController.deleteStage);

module.exports = { stageRouter };
