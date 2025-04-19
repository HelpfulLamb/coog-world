const db = require('../config/db.js');


exports.getAllStages = async () => {
    const query = `
        SELECT 
            Stage_ID, 
            Stage_name, 
            st.area_ID,  
            s.area_name,
            Stage_cost, 
            Stage_maint, 
            Staff_num, 
            Seat_num, 
            Is_operate 
        FROM stages st
        JOIN sectors s ON st.area_ID = s.area_ID;
    `;
    
    try {
        const [results] = await db.query(query);
        return results; 
    } catch (err) {
        throw new Error('Error fetching stages: ' + err.message); 
    }
};


exports.addStage = async (stageData) => {
    const { Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_created_by} = stageData;

    const query = `
        INSERT INTO stages (area_ID, Stage_name, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_created, Stage_created_by)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), ?);
    `;

    try {
        const [result] = await db.query(query, [area_ID, Stage_name, Stage_cost, Stage_maint, Staff_num, Seat_num, Stage_created_by]);
        return result.insertId;  
    } catch (err) {
        throw new Error('Error adding stage: ' + err.message); 
    }
};


exports.updateStage = async (stageID, stageData) => {
    const { Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Is_operate, Stage_updated_by } = stageData;

    const query = `
        UPDATE stages
        SET Stage_name = ?, area_ID = ?, Stage_cost = ?, Stage_maint = ?, Staff_num = ?, Seat_num = ?, Is_operate = ?, Stage_updated = NOW(), Stage_updated_by = ?
        WHERE Stage_ID = ?;
    `;

    try {
        const [result] = await db.query(query, [Stage_name, area_ID, Stage_cost, Stage_maint, Staff_num, Seat_num, Is_operate, Stage_updated_by, stageID]);
        return result.affectedRows > 0;  
    } catch (err) {
        throw new Error('Error updating stage: ' + err.message); 
    }
};


exports.getStageById = async (stageID) => {
    const query = `
        SELECT 
            Stage_ID, 
            Stage_name, 
            s.area_name,
            Stage_cost, 
            Stage_maint, 
            Staff_num, 
            Seat_num, 
            Is_operate 
        FROM stages st
        JOIN sectors s ON st.area_ID = s.area_ID
        WHERE Stage_ID = ?;
    `;
    
    try {
        const [results] = await db.query(query, [stageID]);
        return results[0]; 
    } catch (err) {
        throw new Error('Error fetching stage by ID: ' + err.message); 
    }
};


exports.getAllStagesWithEmployeeInfo = async () => {
    const query = `
        SELECT 
            Stage_ID, 
            Stage_name, 
            s.area_name,
            Stage_cost, 
            Stage_maint, 
            Staff_num, 
            Seat_num, 
            Is_operate, 
            e.First_name AS employee_first_name, 
            e.Last_name AS employee_last_name
        FROM stages st
        JOIN sectors s ON st.area_ID = s.area_ID
        LEFT JOIN employees e ON st.Stage_created_by = e.Emp_ID; 
    `;
    
    try {
        const [results] = await db.query(query);
        return results; 
    } catch (err) {
        throw new Error('Error fetching stages with employee information: ' + err.message); 
    }
};

exports.deleteStage = async (stageid) => {
    await db.query('DELETE FROM stages WHERE Stage_ID = ?', [stageid]);
};