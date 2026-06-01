import React, { useState } from 'react';
import WizardForm from './components/WizardForm';
import InfoSection from './components/InfoSection';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('cotizador');

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            Cotizador
          </div>
          <div className="nav-links">
            <button 
              className={`nav-tab ${activeTab === 'cotizador' ? 'active' : ''}`}
              onClick={() => setActiveTab('cotizador')}
            >
              Nueva Cotización
            </button>
            <button 
              className={`nav-tab ${activeTab === 'coberturas' ? 'active' : ''}`}
              onClick={() => setActiveTab('coberturas')}
            >
              Nuestras Coberturas
            </button>
            <button 
              className={`nav-tab ${activeTab === 'exclusiones' ? 'active' : ''}`}
              onClick={() => setActiveTab('exclusiones')}
            >
              Bienes Excluidos
            </button>
          </div>
        </div>
      </nav>

      <main className="app-layout">
        <div className="app-container">
          {activeTab === 'cotizador' && <WizardForm />}
          {activeTab !== 'cotizador' && <InfoSection activeTab={activeTab} />}
        </div>
      </main>
    </>
  );
}

export default App;
