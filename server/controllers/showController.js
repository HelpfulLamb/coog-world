const showModel = require('../models/showModel.js');
const db = require('../config/db.js');

exports.createShow = async (req, res, body) => {
    try {
        const {Show_name, Stage_ID, Show_start, Show_end, Perf_num, Show_date, Show_cost} = body;
        const showId = await showModel.createShow({Show_name, Stage_ID, Show_start, Show_end, Perf_num, Show_date, Show_cost});
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({id: showId, Show_name, Stage_ID, Show_start, Show_end, Perf_num, Show_date, Show_cost}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.updateShow = async (req, res, id, body) => {
    try {
        const updatedData = body;
        const selectedShow = {...updatedData, Show_ID: id};
        const updatedShow = await showModel.updateShow(selectedShow);
        if(!updatedShow){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Show not found or not updated.'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Show updated successfully.', show: updatedData}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getAllShows = async (req, res) => {
    try {
        const shows = await showModel.getAllShows();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(shows));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getShowForCard = async (req, res) => {
    try {
        const show = await showModel.getShowForCard();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(show));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getShowInfo = async (req, res) => {
    try {
        const shows = await showModel.getShowInfo();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(shows));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getShowById = async (req, res, id) => {
    try {
        const show = await showModel.getShowById(id);
        if(!show){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Show not found'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(ride));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteAllShows = async (req, res) => {
    try {
        await showModel.deleteAllShows();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'All shows deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.deleteShowById = async (req, res, body) => {
    try {
        const {Show_ID} = body;
        if(!Show_ID){
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Invalid show ID.'}));
        }
        await showModel.deleteShowById(Show_ID);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Show deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.logVisitorShow = async (req, res, body) => {
    const {Visitor_ID, Show_ID} = body;
    if (!Visitor_ID || !Show_ID) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ message: 'Visitor_ID and Show_ID are required.' }));
    }
    try {
        await db.query(
            'INSERT INTO visitor_show_log (Visitor_ID, Show_ID) VALUES (?, ?)',
            [Visitor_ID, Show_ID]);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: true, message: 'Show Logged Successfully.'}));
    } catch (error) {
        console.error(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: false, message: 'Failed to log show.', error: error.message}));
    }
};

exports.getVisitorShowHistory = async (req, res, id) => {
    try {
        const history = await showModel.getVisitorShowHistory(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({shows: history}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Failed to fetch watch history.', error: error.message}));
    }
};

exports.getTopShows = async (req, res, body) => {
    try {
        const {startDate, endDate} = body;
        let query = `
        SELECT
        s.Show_name,
        st.Stage_name,
        COUNT(v.log_id) AS total_viewers,
        st.Seat_num AS theatre_capacity,
        ROUND((COUNT(v.log_id) / st.Seat_num) * 100, 2) AS capacity_percent
        FROM shows s
        JOIN visitor_show_log v ON s.Show_ID = v.Show_ID
        JOIN stages st ON s.Stage_ID = st.Stage_ID
        WHERE 1=1`;
        const params = [];
        if(startDate){
            query += ` AND v.watch_date >= ?`;
            params.push(startDate);
        }
        if(endDate){
            query += ` AND v.watch_date <= ?`;
            params.push(endDate);
        }
        query += ` GROUP BY s.Show_ID, st.Stage_ID
        ORDER BY capacity_percent DESC`;
        const [rows] = await db.query(query, params);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(rows));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: `Server error while generating popular shows: ${error.message}`}));
    }
};

exports.getPopularShowToday = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT s.Show_name, DATE(v.watch_date) AS peak_date, COUNT(*) AS views
            FROM shows s
            JOIN visitor_show_log v ON s.Show_ID = v.Show_ID
            GROUP BY s.Show_ID, peak_date
            ORDER BY views DESC
            LIMIT 1`
        );
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};