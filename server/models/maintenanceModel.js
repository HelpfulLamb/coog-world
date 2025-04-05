const db = require('../config/db.js');

exports.createMaintenance = async (Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Status, Maintenance_Object) => {
    const [result] = await db.query(
        'INSERT INTO maintenance (Maintenance_Date, Maint_cost, Maint_Type, Maint_Status, Maint_obj) VALUES (?, ?, ?, ?, ?)',
        [Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Status, Maintenance_Object]
    );
    return result.insertId;
};

exports.getAllMaintenance = async () => {
    const [maintenances] = await db.query('SELECT * FROM maintenance');
    return maintenances;
};

exports.getMaintenanceInfo = async () => {
    const [info] = await db.query('SELECT Maintenance_Date, Maint_cost, Maint_Type, Maint_Status, Maint_obj FROM maintenance');
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