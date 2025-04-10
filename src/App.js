import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import ModelEvaluationPage from "./ModelEvaluationPage";
import LoanApprovalFormPage from "./LoanApprovalFormPage";
import DashboardPage from "./DashboardPage";

// HomePage component - The landing page of our application
function HomePage() {
  return (
    <div className="page-container">
      {/* Page title */}
      <h1>Welcome to XAI Model Loan Approval Project</h1>
      
      {/* Introduction text */}
      <p>This application provides tools for explination, visualizing and evaluating machine learning models.</p>
      
      {/* Grid of options for site navigation */}
      <div className="home-options">
        {/* Loan approval option */}
        <div className="home-option">
          <h2>Loan Approval Form</h2>
          <p>Submit your information for loan approval prediction</p>
          <NavLink to="/loan-approval-form" className="home-button">Apply for Loan</NavLink>
        </div>
        
        {/* Dashboard option */}
        <div className="home-option">
          <h2>Dashboard</h2>
          <p>Explore interactive Tableau dashboard with loan data insights</p>
          <NavLink to="/dashboard" className="home-button">View Dashboard</NavLink>
        </div>
        
        {/* Model evaluation option */}
        <div className="home-option">
          <h2>Model Evaluation</h2>
          <p>Analyze model performance metrics, feature importance and decision tree</p>
          <NavLink to="/model-evaluation" className="home-button">Evaluate Model</NavLink>
        </div>
      </div>
    </div>
  );
}

// Main App component - Sets up routing and overall structure
function App() {
  return (
    // Router wrapper for navigation
    <Router>
      <div className="app-container">
        {/* Navigation bar */}
        <nav className="nav-bar">
          {/* Each NavLink changes the URL and highlights when active */}
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/loan-approval-form" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Loan Approval</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
          <NavLink to="/model-evaluation" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Model Evaluation</NavLink>
        </nav>
        
        {/* Main content area - changes based on route */}
        <div className="content-container">
          <Routes>
            {/* Route definitions - each path shows a different component */}
            <Route path="/" element={<HomePage />} />
            <Route path="/loan-approval-form" element={<LoanApprovalFormPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/model-evaluation" element={<ModelEvaluationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;