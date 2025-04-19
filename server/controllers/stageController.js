const stageModel = require('../models/stageModel.js');

// Get all stages
exports.getStages = async (req, res) => {
    try {
        const stages = await stageModel.getAllStages();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(stages));
    } catch (err) {
        console.error("Error fetching stages:", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Failed to fetch stages'}));
    }
};

// Add a new stage
exports.addStage = async (req, res, body) => {
    const { Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_created_by } = body;

    // Check if the required fields are provided
    if (!Stage_name || !area_ID || !Stage_cost || !Stage_maint || !Staff_num || !Seat_num || !Stage_created_by) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({error: 'Missing required fields: Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_created_by'}));
    }

    try {
        // Insert the new stage into the database
        const newStageID = await stageModel.addStage({
            Stage_name,
            area_ID,
            Stage_cost,
            Stage_maint,
            Staff_num,
            Seat_num,
            Stage_created_by,
        });

        // Return success response with the new stage ID
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Stage added successfully', Stage_ID: newStageID }));
    } catch (err) {
        console.error('Error adding stage:', err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Failed to add stage' })); // Specific error for adding stage
    }
};

// Update an existing stage
exports.updateStage = async (req, res, id, body) => {
    const { Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Is_operate, Stage_updated_by } = body;

    // Check if the required fields are provided
    if (!Stage_name || !area_ID || !Stage_cost || !Stage_maint || !Staff_num || !Seat_num || !Stage_updated_by) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ error: 'Missing required fields: Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_updated_by' }));
    }

    try {
        // Perform the update
        const updated = await stageModel.updateStage(id, {
            Stage_name,
            area_ID,
            Stage_cost,
            Stage_maint,
            Staff_num,
            Seat_num,
            Is_operate,
            Stage_updated_by,
        });

        if (updated) {
            // Fetch the updated stage data and return it in the response
            const updatedStage = await stageModel.getStageById(id);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: 'Stage updated successfully', stage: updatedStage }));
        } else {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ error: 'Stage not found' })); // If no stage was found to update
        }
    } catch (err) {
        console.error('Error updating stage:', err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Failed to update stage' })); // Specific error for updating stage
    }
};

exports.deleteStage = async (req, res, id) => {
    try {
        if(!id){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Invalid stage ID.'}));
        }
        await stageModel.deleteStage(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'Stage deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: error.message}));
    }
};
