import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';

import BaseRouter from './routes/routes';

function App() {
  return (
    <div className="App">
      <Router>
        <BaseRouter />
      </Router>
    </div>
  );
}

export default App;
