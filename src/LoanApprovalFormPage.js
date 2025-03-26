import React, { useState } from 'react';
import axios from 'axios';

const LoanApprovalFormPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    Age: 45,
    Experience: 5,
    Income: 40,
    Family: 1,
    CCAvg: 6.1,
    Education: 1,
    Mortgage: 160,
    'Securities.Account': 1,
    'CD.Account': 1,
    Online: 1,
    CreditCard: 1
  });

  // Results state
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // // Convert numeric fields to numbers
    // if (name !== 'ZIP.Code') {
    //   processedValue = parseFloat(value);
    // }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Handle checkbox changes (binary fields)
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked ? 1 : 0
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict_loan', formData);
      setPrediction(response.data);
    } catch (err) {
      setError('Error submitting the form. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form and results
  const handleReset = () => {
    setFormData({
      Age: 0,
      Experience: 0,
      Income: 0,
      Family: 0,
      CCAvg: 0,
      Education: 0,
      Mortgage: 0,
      'Securities.Account': 0,
      'CD.Account': 0,
      Online: 0,
      CreditCard: 0
    });
    setPrediction(null);
    setError(null);
  };

  // Helper to render changes in counterfactuals
  const renderChanges = (changes) => {
    return Object.entries(changes).map(([key, value]) => (
      <div key={key} className="change-item">
        <strong>{key}:</strong> {value.from} → <span className="highlight">{value.to}</span>
      </div>
    ));
  };

  return (
    <div className="loan-approval-container">
      <h1>Loan Approval Predictor</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <h2>Personal Information</h2>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="Age">Age</label>
                <input 
                  type="number" 
                  id="Age" 
                  name="Age" 
                  value={formData.Age} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="Experience">Experience (years)</label>
                <input 
                  type="number" 
                  id="Experience" 
                  name="Experience" 
                  value={formData.Experience} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="Income">Income (thousands)</label>
                <input 
                  type="number" 
                  id="Income" 
                  name="Income" 
                  value={formData.Income} 
                  onChange={handleChange} 
                  required 
                  step="0.1"
                />
              </div>
              
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="Family">Family Members</label>
                <input 
                  type="number" 
                  id="Family" 
                  name="Family" 
                  value={formData.Family} 
                  onChange={handleChange} 
                  required 
                  min="1"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="Education">Education Level (1-3)</label>
                <select 
                  id="Education" 
                  name="Education" 
                  value={formData.Education} 
                  onChange={handleChange} 
                  required
                >
                  <option value="1">Undergraduate</option>
                  <option value="2">Graduate</option>
                  <option value="3">Advanced/Professional</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <h2>Financial Information</h2>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="CCAvg">Average Credit Card Spending (thousands)</label>
                <input 
                  type="number" 
                  id="CCAvg" 
                  name="CCAvg" 
                  value={formData.CCAvg} 
                  onChange={handleChange} 
                  required 
                  step="0.1"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="Mortgage">Mortgage (thousands)</label>
                <input 
                  type="number" 
                  id="Mortgage" 
                  name="Mortgage" 
                  value={formData.Mortgage} 
                  onChange={handleChange} 
                  required 
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="form-row checkboxes">
              <div className="form-field checkbox">
                <input 
                  type="checkbox" 
                  id="Securities.Account" 
                  name="Securities.Account" 
                  checked={formData['Securities.Account'] === 1} 
                  onChange={handleCheckboxChange} 
                />
                <label htmlFor="Securities.Account">Securities Account</label>
              </div>
              
              <div className="form-field checkbox">
                <input 
                  type="checkbox" 
                  id="CD.Account" 
                  name="CD.Account" 
                  checked={formData['CD.Account'] === 1} 
                  onChange={handleCheckboxChange} 
                />
                <label htmlFor="CD.Account">CD Account</label>
              </div>
              
              <div className="form-field checkbox">
                <input 
                  type="checkbox" 
                  id="Online" 
                  name="Online" 
                  checked={formData.Online === 1} 
                  onChange={handleCheckboxChange} 
                />
                <label htmlFor="Online">Online Banking</label>
              </div>
              
              <div className="form-field checkbox">
                <input 
                  type="checkbox" 
                  id="CreditCard" 
                  name="CreditCard" 
                  checked={formData.CreditCard === 1} 
                  onChange={handleCheckboxChange} 
                />
                <label htmlFor="CreditCard">Credit Card</label>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Processing...' : 'Check Approval'}
            </button>
            <button type="button" className="reset-button" onClick={handleReset}>
              Reset Form
            </button>
          </div>
        </form>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {prediction && (
        <div className={`prediction-result ${prediction.is_approved ? 'approved' : 'rejected'}`}>
          <h2>{prediction.is_approved ? 'Loan Approved! 🎉' : 'Loan Application Declined'}</h2>
          <p className="probability">
            Approval Probability: {(prediction.approval_probability * 100).toFixed(2)}%
          </p>
          
          {!prediction.is_approved && prediction.counterfactuals && (
            <div className="counterfactual-section">
              <h3>How to Improve Your Application</h3>
              <p>Here are some changes that could help you get approved:</p>
              
              <div className="counterfactuals">
                {prediction.counterfactuals.changes.map((change, index) => (
                  <div key={index} className="counterfactual-card">
                    <h4>Option {index + 1}</h4>
                    <div className="changes">
                      {renderChanges(change)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanApprovalFormPage;