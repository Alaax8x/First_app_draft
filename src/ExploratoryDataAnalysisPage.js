import React, { useState, useEffect } from 'react';
import './App.css';

function ExploratoryDataAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataOverview, setDataOverview] = useState(null);

  useEffect(() => {
    // This is a mock fetch - in production, you would connect to your real backend
    // Simulating API fetch with a timeout
    const timer = setTimeout(() => {
      // Simulated successful response
      setDataOverview({
        total_records: 5000,
        features: 12,
        target_distribution: {
          approved: 3750,
          rejected: 1250
        },
        missing_values: "None",
        data_types: {
          numerical: ["Age", "Experience", "Income", "ZIP Code", "Family", "CCAvg", "Mortgage"],
          categorical: ["Education", "Securities Account", "CD Account", "Online", "CreditCard"]
        }
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h1>Exploratory Data Analysis</h1>
        <div className="loading-indicator">Loading data analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Exploratory Data Analysis</h1>
        <div className="error-message">Error loading data: {error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Exploratory Data Analysis</h1>
      
      <div className="eda-container">
        <section className="eda-section">
          <h2>Dataset Overview</h2>
          <div className="data-card-container">
            <div className="data-card">
              <div className="data-card-title">Total Records</div>
              <div className="data-card-value">{dataOverview.total_records}</div>
            </div>
            <div className="data-card">
              <div className="data-card-title">Features</div>
              <div className="data-card-value">{dataOverview.features}</div>
            </div>
            <div className="data-card">
              <div className="data-card-title">Target Distribution</div>
              <div className="data-card-value">
                {Math.round((dataOverview.target_distribution.approved / dataOverview.total_records) * 100)}% Approved
              </div>
            </div>
            <div className="data-card">
              <div className="data-card-title">Missing Values</div>
              <div className="data-card-value">{dataOverview.missing_values}</div>
            </div>
          </div>
        </section>
        
        <section className="eda-section">
          <h2>Feature Types</h2>
          <div className="feature-types">
            <div className="feature-type">
              <h3>Numerical Features</h3>
              <ul className="feature-list">
                {dataOverview.data_types.numerical.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="feature-type">
              <h3>Categorical Features</h3>
              <ul className="feature-list">
                {dataOverview.data_types.categorical.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        
        <section className="eda-section">
          <h2>Data Visualizations</h2>
          <div className="visualization-placeholder">
            <p>Working on it</p>
            <p>This section will contain various data visualizations including:</p>
            <ul>
              <li>Distribution of features</li>
              <li>Correlation heatmap</li>
              <li>Target distribution</li>
              <li>Feature importance</li>
            </ul>
          </div>
        </section>
        
        <section className="eda-section">
          <h2>Key Insights</h2>
          <div className="insights-placeholder">
            <p>Working on it</p>
            <p>This section will summarize key findings from the data analysis:</p>
            <ul>
              <li>Most influential features for loan approval</li>
              <li>Interesting patterns in the data</li>
              <li>Potential biases or issues in the dataset</li>
              <li>Recommendations for feature engineering</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ExploratoryDataAnalysisPage;