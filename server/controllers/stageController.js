const stageModel = require('../models/stageModel.js');

// Get all stages
exports.getStages = async (req, res) => {
    try {
        const stages = await stageModel.getAllStages();
        res.status(200).json(stages);  // Return stages as response
    } catch (err) {
        console.error("Error fetching stages:", err);
        res.status(500).json({ error: 'Failed to fetch stages' }); // More specific error message
    }
};

// Add a new stage
exports.addStage = async (req, res) => {
    const { Stage_name, area_ID, Stage_maint, Staff_num, Seat_num, Is_operate, Stage_created_by } = req.body;

    // Check if the required fields are provided
    if (!Stage_name || !area_ID || !Stage_maint || !Staff_num || !Seat_num || !Stage_created_by) {
        return res.status(400).json({ error: 'Missing required fields: Stage_name, area_ID, Stage_maint, Staff_num, Seat_num, Stage_created_by' });
    }

    try {
        // Insert the new stage into the database
        const newStageID = await stageModel.addStage({
            Stage_name,
            area_ID,
            Stage_maint,
            Staff_num,
            Seat_num,
            Is_operate,
            Stage_created_by,
        });

        // Return success response with the new stage ID
        res.status(201).json({ message: 'Stage added successfully', Stage_ID: newStageID });
    } catch (err) {
        console.error('Error adding stage:', err);
        res.status(500).json({ error: 'Failed to add stage' }); // Specific error for adding stage
    }
};

// Update an existing stage
exports.updateStage = async (req, res) => {
    const Stage_ID = req.params.id;  // Get Stage_ID from the URL parameters
    const { Stage_name, area_ID, Stage_maint, Staff_num, Seat_num, Is_operate, Stage_updated_by } = req.body;

    // Check if the required fields are provided
    if (!Stage_name || !area_ID || !Stage_maint || !Staff_num || !Seat_num || !Stage_updated_by) {
        return res.status(400).json({ error: 'Missing required fields: Stage_name, area_ID, Stage_maint, Staff_num, Seat_num, Stage_updated_by' });
    }

    try {
        // Perform the update
        const updated = await stageModel.updateStage(Stage_ID, {
            Stage_name,
            area_ID,
            Stage_maint,
            Staff_num,
            Seat_num,
            Is_operate,
            Stage_updated_by,
        });

        if (updated) {
            // Fetch the updated stage data and return it in the response
            const updatedStage = await stageModel.getStageById(Stage_ID);
            res.status(200).json({ message: 'Stage updated successfully', stage: updatedStage });
        } else {
            res.status(404).json({ error: 'Stage not found' }); // If no stage was found to update
        }
    } catch (err) {
        console.error('Error updating stage:', err);
        res.status(500).json({ error: 'Failed to update stage' }); // Specific error for updating stage
    }
};

exports.deleteStage = async (req, res) => {
    try {
        const Stage_ID = req.params.id;
        if(!Stage_ID){
            return res.status(400).json({message: 'Invalid stage ID.'});
        }
        await stageModel.deleteStage(Stage_ID);
        return res.status(200).json({message: 'Stage deleted successfully.'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};
