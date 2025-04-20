const db = require('../config/db.js');

exports.findRideByName = async (name) => {
    const [ride] = await db.query('SELECT Ride_name FROM rides WHERE Ride_name = ?', [name])
    return ride[0];
}

exports.createRide = async (rideData) => {
    const { Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff } = rideData;
    const [result] = await db.query(
        'INSERT INTO rides (Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff) VALUES (?, ?, ?, ?, ?)',
        [Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff]
    );
    return result.insertId;
};

exports.updateRide = async (selectedRide) => {
    const { Ride_ID, Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff, Is_operate } = selectedRide;
    const [ride] = await db.query(
        'UPDATE rides SET Ride_name = ?, Ride_type = ?, Ride_loc = ?, Ride_cost = ?, Ride_staff = ?, Is_operate = ? WHERE Ride_ID = ?',
        [Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff, Is_operate, Ride_ID]);
    return ride;
};

exports.getAllRides = async () => {
    const [rides] = await db.query('SELECT * FROM rides');
    return rides;
};

exports.getRideInfo = async () => {
    const [info] = await db.query(
        'SELECT r.Ride_ID, r.Ride_name, r.Ride_type, r.Ride_loc, r.Ride_maint, r.Ride_cost, r.Ride_staff, r.Is_operate, r.Ride_created, s.area_name FROM rides as r, sectors as s WHERE r.Ride_loc = s.area_ID'
    );
    return info;
};

exports.getRideForCard = async () => {
    const [ride] = await db.query(
        'SELECT r.Ride_ID, r.Ride_name, r.Ride_type, s.area_name FROM rides AS r JOIN sectors AS s ON r.Ride_loc = s.area_ID'
    );
    return ride;
};

exports.getRideById = async (id) => {
    const [ride] = await db.query('SELECT * FROM rides WHERE Ride_ID = ?', [id]);
    return ride[0];
};

exports.getRidesCost = async () => {
    const query = `SELECT Ride_name, Ride_cost FROM rides;`;

    try {
        const [results] = await db.query(query);
        return results;
    } catch (err) {
        throw new Error('Error fetching rides: ' + err.message);
    }
};

exports.deleteAllRides = async () => {
    await db.query('DELETE FROM rides');
};

exports.deleteRideById = async (rideid) => {
    await db.query('DELETE FROM rides WHERE Ride_ID = ?', [rideid]);
};

exports.getVisitorRideHistory = async (visitorId) => {
    const [history] = await db.query(
        `SELECT vrl.ride_date, r.Ride_name, r.Ride_type 
         FROM visitor_ride_log vrl
         JOIN rides r ON vrl.Ride_ID = r.Ride_ID
         WHERE vrl.Visitor_ID = ?
         ORDER BY vrl.ride_date DESC`,
        [visitorId]
    );
    return history;
};

exports.getRideStatsByMonth = async (month) => {
    const query = `
        SELECT 
            r.ride_name,
            IFNULL(COUNT(vrl.ride_id), 0) AS total_rides,
            COALESCE(v_top.visitor_name, 'No Riders') AS top_rider,
            COALESCE(v_top.ride_count, 0) AS top_rides,
            DATE(MAX(vrl.ride_date)) AS late_log
        FROM 
            rides r
        LEFT JOIN 
            visitor_ride_log vrl
            ON r.ride_id = vrl.ride_id 
            AND DATE_FORMAT(vrl.ride_date, '%Y-%m') = ?
        LEFT JOIN 
        (
            SELECT 
                ride_id,
                visitor_name,
                ride_count
            FROM (
                SELECT 
                    vrl.ride_id, 
                    CONCAT(v.first_name, ' ', v.last_name) AS visitor_name, 
                    COUNT(*) AS ride_count,
                    ROW_NUMBER() OVER (
                        PARTITION BY vrl.ride_id 
                        ORDER BY COUNT(*) DESC, CONCAT(v.first_name, ' ', v.last_name) ASC
                    ) AS rn
                FROM 
                    visitor_ride_log vrl
                JOIN 
                    visitors v ON v.visitor_id = vrl.visitor_id
                WHERE 
                    DATE_FORMAT(vrl.ride_date, '%Y-%m') = ?
                GROUP BY 
                    vrl.ride_id, vrl.visitor_id
            ) ranked
            WHERE rn = 1
        ) v_top 
        ON v_top.ride_id = r.ride_id
        GROUP BY 
            r.ride_id, r.ride_name, v_top.visitor_name, v_top.ride_count;
    `;

    const [rows] = await db.query(query, [month, month]); 
    return rows;
};
