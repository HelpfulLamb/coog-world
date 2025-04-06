import React, { useState } from 'react';
import axios from 'axios';

const GenerateReportButton = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const generateRainoutsReport = async (format) => {
    setIsLoading(true);
    setError(null); 

    try {
      const baseUrl = window.location.origin; 
      const response = await axios.get(`${baseUrl}/api/reports/rainouts?format=${format}`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      if (format === 'csv') {
        link.setAttribute('download', 'rainouts_report.csv');
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download the report. Please try again.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={() => generateRainoutsReport('csv')} disabled={isLoading}>
        {isLoading ? 'Generating Report...' : 'Generate Rainouts CSV Report'}
      </button>
    </div>
  );
};

export default GenerateReportButton;