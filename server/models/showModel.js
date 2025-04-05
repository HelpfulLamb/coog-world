const db = require('../config/db.js');

exports.createShow = async (userData) => {
    const {Show_name, Stage_ID, Show_start, Show_end, Perf_num, daily_runs, Show_cost} = userData;
    await db.query(
        'INSERT INTO shows (Show_name, Stage_ID, Show_start, Show_end, Perf_num, daily_runs, Show_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Show_name, Stage_ID, Show_start, Show_end, Perf_num, daily_runs, Show_cost]
    );
};

exports.getAllShows = async () => {
    const [shows] = await db.query('SELECT * FROM shows');
    return shows;
};

exports.getShowForCard = async () => {
    const [show] = await db.query(
        'SELECT s.Show_name, s.Show_start, s.Show_date, a.area_name, p.Stage_name FROM shows as s, sectors as a, stages as p WHERE s.Stage_ID = p.Stage_ID and p.area_ID = a.area_ID');
    return show;
};

exports.getShowInfo = async () => {
    const [info] = await db.query(
        'SELECT s.Show_ID, s.Show_name, s.Show_start, s.Show_end, s.Perf_num, s.daily_runs, l.Stage_name, a.area_name, s.Show_cost, s.Show_created FROM shows as s, stages as l, sectors as a WHERE s.Stage_ID = l.Stage_ID and l.area_ID = a.area_ID');
    return info;
};

exports.getShowById = async (id) => {
    const [show] = await db.query('SELECT * FROM shows WHERE Show_ID = ?', [id]);
    return show[0];
};

exports.deleteAllShows = async () => {
    await db.query('DELETE FROM shows');
};

exports.deleteShowById = async (id) => {
    await db.query('DELETE FROM shows WHERE Show_ID = ?', [id]);
};
