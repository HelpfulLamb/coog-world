const db = require('../config/db.js');

exports.createMaintenance = async (Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Status, Maintenance_Object, Maintenance_Object_ID) => {
    const [result] = await db.query(
        'INSERT INTO maintenance (Maintenance_Date, Maint_cost, Maint_Type, Maint_Status, Maint_obj, Maint_obj_ID) VALUES (?, ?, ?, ?, ?, ?)',
        [Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Status, Maintenance_Object, Maintenance_Object_ID]
    );
    return result.insertId;
};

exports.getAllMaintenance = async () => {
    const [maintenances] = await db.query('SELECT * FROM maintenance');
    return maintenances;
};

exports.getObjectsByType = async (objectType) => {
    let query;
    if (objectType === 'ride') {
        query = 'SELECT Ride_ID, Ride_name FROM rides';
    } else if (objectType === 'stage') {
        query = 'SELECT Stage_ID, Stage_name FROM stages';
    } else if (objectType === 'kiosk') {
        query = 'SELECT Kiosk_ID, Kiosk_name FROM kiosks';
    }

    const [objects] = await db.query(query);
    return objects;
};

exports.getMaintenanceInfo = async () => {
    const [info] = await db.query(`
        SELECT 
            m.MaintID, 
            m.Maintenance_Date, 
            m.Maint_cost, 
            m.Maint_Type, 
            m.Maint_Status,
            m.Maint_obj,
            CASE 
                WHEN m.Maint_obj = 'ride' THEN r.Ride_name 
                WHEN m.Maint_obj = 'stage' THEN s.Stage_name 
                WHEN m.Maint_obj = 'kiosk' THEN k.Kiosk_name 
            END AS Maint_obj_name
        FROM maintenance m
        LEFT JOIN rides r ON m.Maint_obj = 'ride' AND m.Maint_obj_ID = r.Ride_ID
        LEFT JOIN stages s ON m.Maint_obj = 'stage' AND m.Maint_obj_ID = s.Stage_ID
        LEFT JOIN kiosks k ON m.Maint_obj = 'kiosk' AND m.Maint_obj_ID = k.Kiosk_ID;
    `);
    return info;
};

exports.getMaintenanceById = async (id) => {
    const [maintenance] = await db.query('SELECT * FROM maintenance WHERE MaintID = ?', [id]);
    return maintenance[0];
};

exports.deleteAllMaintenance = async () => {
    await db.query('DELETE FROM maintenance');
};

exports.deleteMaintenanceById = async (id) => {
    await db.query('DELETE FROM maintenance WHERE MaintID = ?', [id]);
};