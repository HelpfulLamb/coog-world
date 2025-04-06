const reportModel = require('../models/reportModel.js');
const { Parser } = require('json2csv'); 

exports.getRainoutsReport = async (req, res) => {
  try {
    const data = await reportModel.getRainoutsPerMonth();
    console.log("Data fetched successfully:", data);

    if (req.query.format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(data);

      res.header('Content-Type', 'text/csv');
      res.attachment('rainouts_report.csv');
      return res.status(200).send(csv); 
    }

    return res.status(400).json({ message: 'Invalid format specified. Use "csv".' });

  } catch (error) {
    console.error("Error fetching rainouts data:", error); 
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};