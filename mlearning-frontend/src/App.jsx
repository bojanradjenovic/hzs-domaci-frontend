import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Predmeti from './Predmeti';
import Oblasti from './Oblasti';
import Lekcije from './Lekcije';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Predmeti />} />
        <Route path="/:nazivPredmetaLowerReplaced" element={<Oblasti />} />
        <Route path="/:nazivPredmetaLowerReplaced/:nazivOblastiLowerReplaced" element={<Lekcije />} />
      </Routes>
    </Router>
  );
};

export default App;
