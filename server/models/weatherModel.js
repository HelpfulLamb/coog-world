const db = require('../config/db.js');

exports.createWeather = async (weatherData) => {
    const {temperature, Wtr_cond, Wtr_level, Special_alerts} = weatherData;
    const [result] = await db.query(
        'INSERT INTO weather (temperature, Wtr_cond, Wtr_level, Special_alerts) VALUES (?, ?, ?, ?)',
        [temperature, Wtr_cond, Wtr_level, Special_alerts]
    );
    return result.insertId;
};

exports.updateWeather = async (selectedWeather) => {
    const {Wtr_ID, temperature, Wtr_cond, Wtr_level, Special_alerts} = selectedWeather;
    const [weather] = await db.query(
        'UPDATE weather SET temperature = ?, Wtr_cond = ?, Wtr_level = ?, Special_alerts = ? WHERE Wtr_ID = ?', 
        [temperature, Wtr_cond, Wtr_level, Special_alerts, Wtr_ID]);
    return weather;
};

exports.markMessageSeen = async (alertID) => {
    await db.query('UPDATE weather_alerts SET Is_Seen = TRUE WHERE Alert_ID = ?', [alertID]);
};

exports.getWeatherAlerts = async () => {
    const [alert] = await db.query('SELECT * FROM weather_alerts WHERE Is_Seen = FALSE ORDER BY Alert_time DESC');
    return alert;
};

exports.getAllWeather = async () => {
    const [weathers] = await db.query('SELECT * FROM weather');
    return weathers;
};

exports.getWeatherInfo = async () => {
    const [info] = await db.query('SELECT Wtr_ID, temperature, Wtr_cond, Wtr_level, Special_alerts, Wtr_created FROM weather ORDER BY Wtr_created DESC');
    return info;
};

exports.getWeatherById = async (id) => {
    const [weather] = await db.query('SELECT * FROM weather WHERE WtrID = ?', [id]);
    return weather[0];
};

exports.deleteAllWeather = async () => {
    await db.query('DELETE FROM weather');
};

exports.deleteWeatherById = async (wtrid) => {
    await db.query('DELETE FROM weather WHERE Wtr_ID = ?', [wtrid]);
};
