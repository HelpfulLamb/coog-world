const db = require('../config/db.js');

exports.createMaintenance = async (Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Object, Maintenance_Object_ID) => {
    const [result] = await db.query(
        'INSERT INTO maintenance (Maintenance_Date, Maint_cost, Maint_Type, Maint_obj, Maint_obj_ID) VALUES (?, ?, ?, ?, ?)',
        [Maintenance_Date, Maintenance_Cost, Maintenance_Type, Maintenance_Object, Maintenance_Object_ID]
    );
    return result.insertId;
};

exports.updateStatus = async (status) => {
    const {MaintID, Maint_Status, Maint_obj, Maint_obj_ID} = status;
    const [report] = await db.query(
        'UPDATE maintenance SET Maint_Status = ? WHERE MaintID = ?', 
        [Maint_Status, MaintID]);
    if(Maint_Status === 'In Progress'){
        if(Maint_obj === 'ride'){
            await db.query('UPDATE rides SET Is_operate = 0 WHERE Ride_ID = ?', [Maint_obj_ID]);
        } else if(Maint_obj === 'kiosk'){
            await db.query('UPDATE kiosks SET Kiosk_operate = 0 WHERE Kiosk_ID = ?', [Maint_obj_ID]);
        } else if(Maint_obj === 'stage'){
            await db.query('UPDATE stages SET Is_operate = 0 WHERE Stage_ID = ?', [Maint_obj_ID]);
        }
    } else if(Maint_Status === 'Completed'){
        if(Maint_obj === 'ride'){
            await db.query('UPDATE rides SET Is_operate = 1 WHERE Ride_ID = ?', [Maint_obj_ID]);
        } else if(Maint_obj === 'kiosk'){
            await db.query('UPDATE kiosks SET Kiosk_operate = 1 WHERE Kiosk_ID = ?', [Maint_obj_ID]);
        } else if(Maint_obj === 'stage'){
            await db.query('UPDATE stages SET Is_operate = 1 WHERE Stage_ID = ?', [Maint_obj_ID]);
        }
    }
    return report;
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
            m.Maint_obj_ID,
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

// For ride maintenance Report
exports.getRideMaintenance = async (month) => {
    const query = `
        SELECT 
            r.ride_name,
            IFNULL(m_count.total_maint, 0) AS total_maintenance,
            ml.log_message,
            ml.log_date
        FROM 
            rides r
        LEFT JOIN 
            (
                SELECT 
                    m.maint_obj_ID,
                    COUNT(*) AS total_maint
                FROM 
                    maintenance m
                WHERE 
                    DATE_FORMAT(m.maint_created, '%Y-%m') = ?
                GROUP BY 
                    m.maint_obj_ID
            ) m_count
            ON m_count.maint_obj_ID = r.ride_ID
        LEFT JOIN 
            (
                SELECT 
                    ml.object_ID,
                    ml.message AS log_message,
                    ml.log_date
                FROM 
                    maintenance_log ml
                JOIN 
                (
                    -- Get latest log per object
                    SELECT 
                        object_ID, 
                        MAX(log_date) AS latest_log_date
                    FROM 
                        maintenance_log
                    GROUP BY 
                        object_ID
                ) latest_ml
                ON ml.object_ID = latest_ml.object_ID 
                AND ml.log_date = latest_ml.latest_log_date
            ) ml
            ON ml.object_ID = r.ride_ID;
    `;
  
    const [rows] = await db.query(query, [month]); // Use the db connection's query method
    return rows;
};

exports.deleteAllMaintenance = async () => {
    await db.query('DELETE FROM maintenance');
};

exports.deleteMaintenanceById = async (id) => {
    await db.query('DELETE FROM maintenance WHERE MaintID = ?', [id]);
};