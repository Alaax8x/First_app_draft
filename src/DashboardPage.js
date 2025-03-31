import React, { useEffect } from 'react';
import './App.css';

function DashboardPage() {
  useEffect(() => {
    // Load Tableau script 
    const loadTableauScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };
    
    const cleanup = loadTableauScript();
    
// Replace the initTableau function with this:
const initTableau = () => {
  if (window.tableau && document.getElementById('viz1743276850044')) {
    const divElement = document.getElementById('viz1743276850044');
    const vizElement = divElement.getElementsByTagName('object')[0];
    
    // Make viz visible first
    vizElement.style.display = 'block';
    
    // Make it responsive
    vizElement.style.width = '100%';
    
    // Set height based on container width
    if (window.innerWidth > 1200) {
      vizElement.style.height = '80vh';
    } else if (window.innerWidth > 800) {
      vizElement.style.height = '75vh';
    } else {
      vizElement.style.height = '70vh';
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1200) {
        vizElement.style.height = '80vh';
      } else if (window.innerWidth > 800) {
        vizElement.style.height = '75vh';
      } else {
        vizElement.style.height = '70vh';
      }
    });
  }
};
  // Main initialization sequence
  // Main initialization sequence
  const init = async () => {
    await loadTableauScript();
    
    // Try multiple times with increasing delays
    let attempts = 0;
    const maxAttempts = 5;
    
    const tryInit = () => {
      attempts++;
      if (window.tableau && document.getElementById('viz1743276850044')) {
        initTableau();
      } else if (attempts < maxAttempts) {
        setTimeout(tryInit, 500 * attempts); // Increasing delay
      }
    };
    
    tryInit();
  };
  
  init();
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', initTableau);
  };
}, []);
  


  return (
    <div className="page-container">
      <h1>Bank Loan Dashboard</h1>
      
      <div className="dashboard-container">
        <section className="dashboard-intro">
          <h2>Interactive Loan Analysis Dashboard</h2>
          <p>
            Explore comprehensive insights into loan applications, approvals, and customer demographics.
            This dashboard provides an overview of key metrics and trends in our loan data.
          </p>
        </section>
        
        <div className="tableau-viz-container" id="tableauVizContainer">
          <div className='tableauPlaceholder' id='viz1743276850044'>
            <noscript>
              <a href='#'>
                <img 
                  alt='Dashboard 1' 
                  src='https://public.tableau.com/static/images/Ba/BankloanDashboard_17432767131830/Dashboard1/1_rss.png' 
                  style={{border: 'none'}} 
                />
              </a>
            </noscript>
            <object className='tableauViz'>
              <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
              <param name='embed_code_version' value='3' />
              <param name='site_root' value='' />
              <param name='name' value='BankloanDashboard_17432767131830/Dashboard1' />
              <param name='tabs' value='no' />
              <param name='toolbar' value='yes' />
              <param name='static_image' value='https://public.tableau.com/static/images/Ba/BankloanDashboard_17432767131830/Dashboard1/1.png' />
              <param name='animate_transition' value='yes' />
              <param name='display_static_image' value='yes' />
              <param name='display_spinner' value='yes' />
              <param name='display_overlay' value='yes' />
              <param name='display_count' value='yes' />
              <param name='language' value='en-GB' />
              <param name='filter' value='publish=yes' />
            </object>
          </div>
        </div>
        
        <section className="dashboard-guide">
          <h2>How to Use This Dashboard</h2>
          <ul>
            <li>Use the filters on the right to narrow down the data by customer segments</li>
            <li>Hover over charts for detailed information</li>
            <li>Click on elements in one chart to see related data across other visualizations</li>
            <li>Use the toolbar options to download or share specific views</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;