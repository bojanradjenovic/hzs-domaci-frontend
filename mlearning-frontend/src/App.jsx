import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Predmeti from './Predmeti';
import Oblasti from './Oblasti';
import Lekcije from './Lekcije';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Predmeti />} />  {/* Početna stranica za predmete */}
        <Route path="/oblasti/:id_predmeta" element={<Oblasti />} />  {/* Stranica za oblasti, sa ID predmeta */}
        <Route path="/lekcije/:id_oblasti" element={<Lekcije />} />  {/* Stranica za lekcije, sa ID oblasti */}
      </Routes>
    </Router>
  );
};

export default App;
