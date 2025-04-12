import React, { useState } from 'react';
import axios from 'axios';

const LoanApprovalFormPage = () => {
  // State to store form input values
  // This is React's way of managing data that changes in the component
  const [formData, setFormData] = useState({
    Age: 45,
    Experience: 5,
    Income: 40.0,
    Family: 1,
    CCAvg: 6.1,
    Education: 1,
    Mortgage: 160,
    'Securities.Account': 1,
    'CD.Account': 1,
    Online: 1,
    CreditCard: 1
  });

  // State to store API response and UI states
  const [prediction, setPrediction] = useState(null); // Stores prediction results
  const [loading, setLoading] = useState(false);      // Tracks if form is submitting
  const [error, setError] = useState(null);           // Stores any error messages

  // Handle text/number input changes
  // This function updates the formData state when input values change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert to number and validate Education values
    const numValue = Number(value);
    if (name === 'Education' && (numValue < 1 || numValue > 3)) {
      return; // Don't update if Education value is invalid
    }
    setFormData({
      ...formData,
      [name]: numValue
    });
  };

  // Handle checkbox input changes (converts to 0 or 1)
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked ? 1 : 0 // Convert boolean to 1 or 0
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);   // Show loading state
    setError(null);     // Clear any previous errors
    
    try {
      // Send form data to backend API
      const response = await axios.post('http://127.0.0.1:5000/predict_loan', formData);
      setPrediction(response.data); // Store prediction results
    } catch (err) {
      // Handle errors
      setError('Error submitting the form. Please try again.');
      console.error(err);
    } finally {
      setLoading(false); // Hide loading state when done
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData({
      Age: '',
      Experience: '',
      Income: '',
      Family: '',
      CCAvg: '',
      Education: '',
      Mortgage: '',
      'Securities.Account': 0,
      'CD.Account': 0,
      Online: 0,
      CreditCard: 0
    });
    setPrediction(null); // Clear any prediction results
    setError(null);      // Clear any errors
  };

  // Helper function to display counterfactual changes
  // Shows what changes could help get an approval
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
      
      {/* Form container */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="form-group">
            <h2>Personal Information</h2>
            
            <div className="form-row">
              {/* Age field */}
              <div className="form-field">
                <label htmlFor="Age">Age</label>
                <input 
                  type="number" 
                  id="Age" 
                  name="Age" 
                  value={formData.Age} 
                  onChange={handleChange} 
                  required 
                  min={18}
                />
              </div>
              
              {/* Experience field */}
              <div className="form-field">
                <label htmlFor="Experience">Experience (years)</label>
                <input 
                  type="number" 
                  id="Experience" 
                  name="Experience" 
                  value={formData.Experience} 
                  onChange={handleChange} 
                  required 
                  min={0}
                />
              </div>
            </div>
            
            <div className="form-row">
              {/* Income field */}
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
                  min={1}
                />
              </div>
            </div>
            
            <div className="form-row">
              {/* Family members field */}
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
              
              {/* Education level dropdown */}
              <div className="form-field">
                <label htmlFor="Education">Education Level (1-3)</label>
                <select 
                  id="Education" 
                  name="Education" 
                  value={formData.Education} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="1">Undergraduate</option>
                  <option value="2">Graduate</option>
                  <option value="3">Advanced/Professional</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Financial Information Section */}
          <div className="form-group">
            <h2>Financial Information</h2>
            
            <div className="form-row">
              {/* Credit card spending field */}
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
                  min={0}
                />
              </div>
              
              {/* Mortgage field */}
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
                  min={0}
                />
              </div>
            </div>
            
            {/* Checkbox options section */}
            <div className="form-row checkboxes">
              {/* Securities Account checkbox */}
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
              
              {/* CD Account checkbox */}
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
              
              {/* Online Banking checkbox */}
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
              
              {/* Credit Card checkbox */}
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
          
          {/* Form action buttons */}
          <div className="form-actions">
            {/* Submit button - disabled when loading */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Processing...' : 'Check Approval'}
            </button>
            
            {/* Reset button */}
            <button type="button" className="reset-button" onClick={handleReset}>
              Reset Form
            </button>
          </div>
        </form>
      </div>
      
      {/* Show error message if there's an error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Show prediction results if available */}
      {prediction && (
        <div className={`prediction-result ${prediction.is_approved ? 'approved' : 'rejected'}`}>
          <h2>{prediction.is_approved ? 'Loan Approved! 🎉' : 'Loan Application Declined'}</h2>
          <p className="probability">
            Approval Probability: {(prediction.approval_probability * 100).toFixed(2)}%
          </p>
          
          {/* Show improvement suggestions if loan was rejected */}
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