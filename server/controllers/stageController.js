const stageModel = require('../models/stageModel.js');

exports.getStages = async (req, res) => {
    try {
        const stages = await stageModel.getAllStages();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stages));
    } catch (err) {
        console.error("Error fetching stages:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch stages' }));
    }
};

exports.addStage = async (req, res, body) => {
    const { Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_created_by } = body;

    if (!Stage_name || !area_ID || !Stage_cost || !Stage_maint || !Staff_num || !Seat_num || !Stage_created_by) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing required fields: Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_created_by' }));
    }

    try {
        const newStageID = await stageModel.addStage({
            Stage_name,
            area_ID,
            Stage_cost,
            Stage_maint,
            Staff_num,
            Seat_num,
            Stage_created_by,
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Stage added successfully', Stage_ID: newStageID }));
    } catch (err) {
        console.error('Error adding stage:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to add stage' }));
    }
};

exports.updateStage = async (req, res, id, body) => {
    const { Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Is_operate, Stage_updated_by } = body;

    if (!Stage_name || !area_ID || !Stage_cost || !Stage_maint || !Staff_num || !Seat_num || !Stage_updated_by) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing required fields: Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_updated_by' }));
    }
    try {
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
            const updatedStage = await stageModel.getStageById(id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Stage updated successfully', stage: updatedStage }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Stage not found' }));
        }
    } catch (err) {
        console.error('Error updating stage:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update stage' }));
    }
};

exports.getStagesTotalCost = async (req, res) => {
    try {
        const stages = await stageModel.getStagesCost();
        if (!stages) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Stage not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stages));
    } catch (err) {
        console.error('Error fetching stages:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error fetching stages' }));
    }
};

exports.deleteStage = async (req, res, id) => {
    try {
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid stage ID.' }));
        }
        await stageModel.deleteStage(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Stage deleted successfully.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: error.message }));
    }
};
