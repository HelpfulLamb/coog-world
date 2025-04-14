const maintenanceModel = require('../models/maintenanceModel.js');
const db = require('../config/db.js');

exports.createMaintenance = async (req, res) => {
    try {
        const { Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Object, Maintenance_Object_ID} = req.body;

        if (!Maintenance_Date || !Maintenance_Cost || !Maintenance_Type || !Maintenance_Object || !Maintenance_Object_ID) {
            return res.status(400).json({ message: 'All fields are required. Server may be unavailable.' });
        }

        const maintenanceId = await maintenanceModel.createMaintenance(Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Object, Maintenance_Object_ID);

        if (!maintenanceId) {
            return res.status(500).json({ message: 'Failed to create maintenance record.' });
        }

        res.status(201).json({
            id: Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Object
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const maintID = req.params.id;
        const updatedData = req.body;
        const selectedMaint = {...updatedData, MaintID: maintID};
        const updatedMaint = await maintenanceModel.updateStatus(selectedMaint);
        if(!updatedMaint){
            return res.status(404).json({message: 'Maintenance not found or not updated.'});
        }
        res.status(200).json({message: 'Status updated successfully.', maintenance: updatedData});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getObjectsByType = async (req, res) => {
    try {
        const objectType = req.params.objectType; 
        const objects = await maintenanceModel.getObjectsByType(objectType);

        res.status(200).json(objects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllMaintenance = async (req, res) => {
    try {
        const maintenance = await maintenanceModel.getAllMaintenance();
        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getMaintenanceInfo = async (req, res) => {
    try {
        const info = await maintenanceModel.getMaintenanceInfo();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await maintenanceModel.getMaintenanceById(req.params.id);
        if(!maintenance){
            return res.status(404).json({message: 'Maintenance not found'});
        }
        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Function to fetch ride maintenance stats by month
exports.getParkMaintenance = async (req, res) => {
    const { month, object = 'ride', type = 'both' } = req.query;
    const validObjects = ['ride', 'kiosk', 'stage'];
    const monthFormatRegex = /^\d{4}-\d{2}$/;
    if (!month) {
        return res.status(400).json({ message: 'Month is required.' });
    }
    if (!monthFormatRegex.test(month)) {
        return res.status(400).json({ message: 'Invalid month format. Please use YYYY-MM format.' });
    }
    if(!validObjects.includes(object)){
        return res.status(400).json({message: 'Invalid object type'});
    }
    try {
        const stats = await maintenanceModel.getParkMaintenance(month, object, type);
        if (stats.length === 0) { // Handle case where no data is found
            return res.status(404).json({message: `No ${object} stats found for this month.`});
        }
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteAllMaintenance = async (req, res) => {
    try {
        await maintenanceModel.deleteAllMaintenance();
        res.status(200).json({message: 'All maintenance deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteMaintenanceById = async (req, res) => {
    try {
        await maintenanceModel.deleteMaintenanceById(req.params.id);
        res.status(200).json({message: 'Maintenance deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getRideBreakdowns = async (req, res) => {
    try {
        const [ride] = await db.query(`
            SELECT 
            r.Ride_name,
            COUNT(m.MaintID) AS num_breakdowns,
            MAX(m.Maintenance_Date) AS last_breakdown_date
            FROM maintenance m
            JOIN rides r ON m.Maint_obj = 'ride' AND m.Maint_obj_ID = r.Ride_ID
            WHERE m.Maint_Type = 'Emergency'
            GROUP BY r.Ride_ID
            ORDER BY num_breakdowns DESC;`);
        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
exports.getStageBreakdowns = async (req, res) => {
    try {
        const [stage] = await db.query(`
            SELECT 
                s.Stage_name,
                COUNT(m.MaintID) AS emergency_count,
                MAX(m.Maintenance_Date) AS last_emergency_date
            FROM maintenance m
            JOIN stages s ON m.Maint_obj = 'stage' AND m.Maint_obj_ID = s.Stage_ID
            WHERE m.Maint_Type = 'Emergency'
            GROUP BY s.Stage_ID
            ORDER BY emergency_count DESC, last_emergency_date DESC;`);
        res.status(200).json(stage);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
exports.getKioskBreakdowns = async (req, res) => {
    try {
        const [kiosk] = await db.query(`
            SELECT 
                k.Kiosk_name,
                COUNT(m.MaintID) AS emergency_count,
                MAX(m.Maintenance_Date) AS last_emergency_date
            FROM maintenance m
            JOIN kiosks k ON m.Maint_obj = 'kiosk' AND m.Maint_obj_ID = k.Kiosk_ID
            WHERE m.Maint_Type = 'Emergency'
            GROUP BY k.Kiosk_ID
            ORDER BY emergency_count DESC, last_emergency_date DESC;`);
        res.status(200).json(kiosk);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getOpenMaintenanceCount = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT COUNT(*) AS openCount
        FROM maintenance
        WHERE Maint_Status IN ('PENDING', 'IN PROGRESS')
      `);
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Error fetching open maintenance count:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };