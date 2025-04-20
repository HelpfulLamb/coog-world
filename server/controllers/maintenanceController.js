const maintenanceModel = require('../models/maintenanceModel.js');
const db = require('../config/db.js');
const url = require('url');

exports.createMaintenance = async (req, res, body) => {
    try {
        const { Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Object, Maintenance_Object_ID} = body;
        if (!Maintenance_Date || !Maintenance_Cost || !Maintenance_Type || !Maintenance_Object || !Maintenance_Object_ID) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ message: 'All fields are required. Server may be unavailable.' }));
        }
        const maintenanceId = await maintenanceModel.createMaintenance(Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Object, Maintenance_Object_ID);
        if (!maintenanceId) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ message: 'Failed to create maintenance record.' }));
        }
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            id: Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Object
        }));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.updateStatus = async (req, res, id, body) => {
    try {
        const updatedData = body;
        const selectedMaint = {...updatedData, MaintID: id};
        const updatedMaint = await maintenanceModel.updateStatus(selectedMaint);
        if(!updatedMaint){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Maintenance not found or not updated.'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Status updated successfully.', maintenance: updatedData}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.markMessageSeen = async (req, res, id) => {
    try {
        await maintenanceModel.markMessageSeen(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Maintenance alert acknowledged.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.markRepairSeen = async (req, res, id) => {
    try {
        await maintenanceModel.markRepairSeen(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Repair alert acknowledged.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getMaintenanceAlerts = async (req, res) => {
    try {
        const message = await maintenanceModel.getMaintenanceAlerts();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(message || []));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getRepairAlerts = async (req, res) => {
    try {
        const message = await maintenanceModel.getRepairAlerts();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(message || []));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getObjectsByType = async (req, res, type) => {
    try {
        const objects = await maintenanceModel.getObjectsByType(type);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(objects));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getAllMaintenance = async (req, res) => {
    try {
        const maintenance = await maintenanceModel.getAllMaintenance();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(maintenance));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getMaintenanceInfo = async (req, res) => {
    try {
        const info = await maintenanceModel.getMaintenanceInfo();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(info));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getMaintenanceById = async (req, res, id) => {
    try {
        const maintenance = await maintenanceModel.getMaintenanceById(id);
        if(!maintenance){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Maintenance not found'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(maintenance));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getParkMaintenance = async (req, res) => {
    const {query} = url.parse(req.url, true);
    const { month, object = 'ride', type = 'both' } = query;
    const validObjects = ['ride', 'kiosk', 'stage'];
    const monthFormatRegex = /^\d{4}-\d{2}$/;
    if (!month) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ message: 'Month is required.' }));
    }
    if (!monthFormatRegex.test(month)) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ message: 'Invalid month format. Please use YYYY-MM format.' }));
    }
    if(!validObjects.includes(object)){
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'Invalid object type'}));
    }
    try {
        const stats = await maintenanceModel.getParkMaintenance(month, object, type);
        if (stats.length === 0) { 
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: `No ${object} stats found for this month.`}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(stats));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getDetailedMaintenance = async (req, res) => {
    const {query} = url.parse(req.url, true);
    const {objectType = 'ride', objectID = ''} = query;
    const validObjects = ['ride', 'kiosk', 'stage'];
    if(!validObjects.includes(objectType)){
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'Invalid object type.'}));
    }
    if(!objectID){
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'Object ID is required.'}));
    }
    try {
        const details = await maintenanceModel.getDetailedMaintenance(objectType, objectID);
        if(details.length === 0){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: `No ${objectType} details found.`}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(details));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.deleteAllMaintenance = async (req, res) => {
    try {
        await maintenanceModel.deleteAllMaintenance();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'All maintenance deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteMaintenanceById = async (req, res, body) => {
    try {
        const {Maint_ID} = body;
        await maintenanceModel.deleteMaintenanceById(Maint_ID);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Maintenance deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
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
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(ride));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
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
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(stage));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
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
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(kiosk));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getOpenMaintenanceCount = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT COUNT(*) AS openCount
        FROM maintenance
        WHERE Maint_Status IN ('PENDING', 'IN PROGRESS')
      `);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(rows[0]));
    } catch (err) {
      console.error('Error fetching open maintenance count:', err);
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ error: 'Database error' }));
    }
  };