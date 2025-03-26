import React, { useEffect, useState } from 'react';
import './App.css';

function ModelEvaluationPage() {
  const [report, setReport] = useState(null);
  const [confMatrixUrl, setConfMatrixUrl] = useState("");
  const [featureImportanceUrl, setFeatureImportanceUrl] = useState("");
  const [htmlUrl, setHtmlUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:5000/api/ml")
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setReport(data.report);
        setConfMatrixUrl(data.conf_matrix_url);
        setFeatureImportanceUrl(data.feature_importance_url);
        setHtmlUrl(data.html_url);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

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
      
      <section className="metrics-section">
        <h2>Classification Report</h2>
        {isLoading ? (
          <div className="loading-indicator">Loading metrics...</div>
        ) : (
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
                {report && Object.keys(report).map((label, index) => {
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

      <div className="visualizations-grid">
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