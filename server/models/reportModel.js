const db = require('../config/db.js');

exports.getRainoutsPerMonth = async () => {
    const query = `
      SELECT
        YEAR(Wtr_created) AS year,
        MONTH(Wtr_created) AS month,
        COUNT(*) AS rainouts
      FROM weather
      WHERE Wtr_level = 'Severe'
        AND Is_park_closed = 1
        AND Wtr_cond NOT IN ('Sunny', 'Foggy')
      GROUP BY YEAR(Wtr_created), MONTH(Wtr_created)
      ORDER BY year, month;
    `;
    
    try {
      console.log("Executing query:", query); 
      const [rainouts] = await db.query(query);
      if (rainouts.length === 0) {
        throw new Error('No rainouts found for the given criteria');
      }
      return rainouts;
    } catch (error) {
      console.error("Database query error:", error); 
      throw new Error('Error fetching rainouts data: ' + error.message);
    }
  };

  exports.getTopRidePerMonth = async () => {
    const query = `
      SELECT
        YEAR(ride_date) AS year,
        MONTH(ride_date) AS month,
        r.Ride_name
      FROM visitor_ride_log as v, rides as r
      WHERE v.Ride_ID = r.Ride_ID
      GROUP BY YEAR(ride_date), MONTH(ride_date)
      ORDER BY year, month;
    `;
    
    try {
      console.log("Executing query:", query); 
      const [rainouts] = await db.query(query);
      if (rainouts.length === 0) {
        throw new Error('No data found for the given criteria');
      }
      return rainouts;
    } catch (error) {
      console.error("Database query error:", error); 
      throw new Error('Error fetching monthly ride data: ' + error.message);
    }
  };  