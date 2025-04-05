const db = require('../config/db.js');

exports.createWeather = async (date_recorded, condition, rainout_num, rainout_date, precipitation, temperature, air_quality, uv_index, alerts) => {
    const [result] = await db.query(
        'INSERT INTO weather (Date_recorded, Wtr_cond, Num_rnout, Rnout_date, Precp_level, Wtr_temp, Air_qual, UV_ind, Special_alerts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [date_recorded, condition, rainout_num, rainout_date, precipitation, temperature, air_quality, uv_index, alerts]
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
