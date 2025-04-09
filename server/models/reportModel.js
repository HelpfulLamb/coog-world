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
    const [rainouts] = await db.query(query);
    if (rainouts.length === 0) {
      throw new Error('No rainouts found for the given criteria');
    }
    return rainouts;
  } catch (error) {
    throw new Error('Error fetching rainouts data: ' + error.message);
  }
};

/*exports.getTotalRevenue = async () => {
  // Return mock data instead of querying the database
  return {
    ticketRevenue: 12000.50,
    merchRevenue: 8700.25,
    totalRevenue: 20700.75
  };
};*/

exports.getRevenueSummary = async () => {
  const query = `
    SELECT 
      SUM(CASE WHEN product_type = 'Ticket' THEN total_amount ELSE 0 END) AS ticketRevenue,
      SUM(CASE WHEN product_type = 'Merchandise' THEN total_amount ELSE 0 END) AS merchRevenue,
      SUM(total_amount) AS totalRevenue
    FROM product_purchases;
  `;

  try {
    const [results] = await db.query(query);
    if (!results || results.length === 0) {
      throw new Error('No revenue data found');
    }

    // Return the first row
    return results[0];
  } catch (error) {
    throw new Error('Error generating revenue data: ' + error.message);
  }
};