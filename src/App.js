import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import ModelEvaluationPage from "./ModelEvaluationPage";
import LoanApprovalFormPage from "./LoanApprovalFormPage";
import DashboardPage from "./DashboardPage";

function HomePage() {
  return (
    <div className="page-container">
      <h1>Welcome to ML Model Analysis Project</h1>
      <p>This application provides tools for visualizing and evaluating machine learning models.</p>
      <div className="home-options">
        <div className="home-option">
          <h2>Loan Approval Form</h2>
          <p>Submit your information for loan approval prediction</p>
          <NavLink to="/loan-approval-form" className="home-button">Apply for Loan</NavLink>
        </div>
        <div className="home-option">
          <h2>Data Visualization</h2>
          <p>View interactive charts and graphs of your dataset</p>
          <NavLink to="/visualisation" className="home-button">View Visualizations</NavLink>
        </div>
        <div className="home-option">
          <h2>Dashboard</h2>
          <p>Explore interactive Tableau dashboard with loan data insights</p>
          <NavLink to="/dashboard" className="home-button">View Dashboard</NavLink>
        </div>
        <div className="home-option">
          <h2>Model Evaluation</h2>
          <p>Analyze model performance metrics and feature importance</p>
          <NavLink to="/model-evaluation" className="home-button">Evaluate Model</NavLink>
        </div>
      </div>
    </div>
  );
}

function VisualizationPage() {
  return (
    <div className="page-container">
      <h1>Data Visualizations</h1>
      <p>This page will contain interactive visualizations of your dataset.</p>
      <div className="placeholder-container">
        <div className="placeholder-message">
          Visualization components coming soon
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav-bar">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/loan-approval-form" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Loan Approval</NavLink>
          <NavLink to="/visualisation" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Visualizations</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
          <NavLink to="/model-evaluation" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Model Evaluation</NavLink>
        </nav>
        <div className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loan-approval-form" element={<LoanApprovalFormPage />} />
            <Route path="/visualisation" element={<VisualizationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/model-evaluation" element={<ModelEvaluationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;