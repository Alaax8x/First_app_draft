import React, { useEffect, useState } from 'react';

function ModelEvaluationPage() {
  // State variables to store data and UI states
  const [report, setReport] = useState(null);             // Classification report data
  const [confMatrixUrl, setConfMatrixUrl] = useState(""); // URL for confusion matrix image
  const [featureImportanceUrl, setFeatureImportanceUrl] = useState(""); // URL for feature importance image
  const [htmlUrl, setHtmlUrl] = useState("");             // URL for HTML tree visualization
  const [isLoading, setIsLoading] = useState(true);       // Loading state tracker
  const [error, setError] = useState(null);               // Error message storage

  // useEffect runs once when component mounts
  useEffect(() => {
    // Set loading state to true
    setIsLoading(true);
    
    // Fetch data from backend API
    fetch("http://127.0.0.1:5000/api/ml")
      .then(res => {
        // Check if response is successful
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        // Parse JSON response
        return res.json();
      })
      .then(data => {
        // Store data in state variables
        setReport(data.report);
        setConfMatrixUrl(data.conf_matrix_url);
        setFeatureImportanceUrl(data.feature_importance_url);
        setHtmlUrl(data.html_url);
        setIsLoading(false); // Hide loading state
      })
      .catch(err => {
        // Handle any errors
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false); // Hide loading state even on error
      });
  }, []); // Empty dependency array means this runs once when component mounts

  // Show error message if there's an error
  if (error) {
    return (
      <div className="page-container error-container">
        <h1>Loan Approval: Model Evaluation</h1>
        <div className="error-message">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <p>Make sure your API server is running at http://127.0.0.1:5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Loan Approval: Model Evaluation</h1>
      
      {/* Classification Report Section */}
      <section className="metrics-section">
        <h2>Classification Report</h2>
        {isLoading ? (
          // Show loading indicator while data is being fetched
          <div className="loading-indicator">Loading metrics...</div>
        ) : (
          // Show table with classification metrics
          <div className="table-container">
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                  <th>Support</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through the report data to create table rows */}
                {report && Object.keys(report).map((label, index) => {
                  // Only render if the value is an object (contains metric data)
                  if (typeof report[label] === "object") {
                    return (
                      <tr key={index}>
                        <td>{label}</td>
                        <td>{report[label].precision?.toFixed(2)}</td>
                        <td>{report[label].recall?.toFixed(2)}</td>
                        <td>{report[label]["f1-score"]?.toFixed(2)}</td>
                        <td>{report[label].support}</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Visualizations Grid Section */}
      <div className="visualizations-grid">
        {/* Confusion Matrix */}
        <section className="visualization-section">
          <h2>Confusion Matrix</h2>
          {isLoading ? (
            <div className="loading-indicator">Loading visualization...</div>
          ) : confMatrixUrl ? (
            <img src={confMatrixUrl} alt="Confusion Matrix" className="visualization-image" />
          ) : (
            <div className="no-data">No confusion matrix data available</div>
          )}
        </section>

        {/* Feature Importance */}
        <section className="visualization-section">
          <h2>Feature Importance</h2>
          {isLoading ? (
            <div className="loading-indicator">Loading visualization...</div>
          ) : featureImportanceUrl ? (
            <img src={featureImportanceUrl} alt="Feature Importance" className="visualization-image" />
          ) : (
            <div className="no-data">No feature importance data available</div>
          )}
        </section>
      </div>

      {/* Tree Visualization Section */}
      <section className="tree-visualization-section">
        <h2>Random Forest Tree Visualization</h2>
        {isLoading ? (
          <div className="loading-indicator">Loading tree visualization...</div>
        ) : htmlUrl ? (
          <div className="iframe-container">
            <iframe 
              src={htmlUrl} 
              title="Random Forest Tree" 
              className="tree-iframe"
              sandbox="allow-scripts allow-same-origin"
              style={{ width: '100%', height: '700px', border: '1px solid #ddd' }}
            ></iframe>
          </div>
        ) : (
          <div className="no-data">No tree visualization data available</div>
        )}
      </section>
    </div>
  );
}

export default ModelEvaluationPage;