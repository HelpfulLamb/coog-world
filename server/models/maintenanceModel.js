const db = require('../config/db.js');

exports.createMaintenance = async (maint_date, cost, repair_date, type, objective, num) => {
    const [result] = await db.query(
        'INSERT INTO maintenance (Maintenance_Date, Repair_Cost, Repair_Date, Maint_cost, Maint_Type, Maint_obj, Maint_num) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [maint_date, cost, repair_date, type, objective, num]
    );
    return result.insertId;
};

exports.getAllMaintenance = async () => {
    const [maintenances] = await db.query('SELECT * FROM maintenance');
    return maintenances;
};

exports.getMaintenanceInfo = async () => {
    const [info] = await db.query('SELECT Maintenance_Date, Maint_cost, Maint_Type, Maint_Status FROM maintenance');
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