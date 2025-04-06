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