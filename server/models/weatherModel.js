const db = require('../config/db.js');

exports.createWeather = async (userData) => {
    const {Wtr_cond, Wtr_level, Special_alerts, Is_park_closed} = userData;
    const [result] = await db.query(
        'INSERT INTO weather (Wtr_cond, Wtr_level, Special_alerts, Is_park_closed) VALUES (?, ?, ?, ?)',
        [Wtr_cond, Wtr_level, Special_alerts, Is_park_closed]
    );
    return result.insertId;
};
exports.getAllWeather = async () => {
    const [weathers] = await db.query('SELECT * FROM weather');
    return weathers;
};

exports.getWeatherInfo = async () => {
    const [info] = await db.query('SELECT Wtr_ID, Wtr_cond, Wtr_level, Special_alerts, Wtr_created FROM weather');
    return info
};

exports.getWeatherById = async (id) => {
    const [weather] = await db.query('SELECT * FROM weather WHERE WtrID = ?', [id]);
    return weather[0];
};

exports.deleteAllWeather = async () => {
    await db.query('DELETE FROM weather');
};

exports.deleteWeatherById = async (id) => {
    await db.query('DELETE FROM weather WHERE WtrID = ?', [id]);
};
