import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import React from 'react';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
