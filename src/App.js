import React from 'react';
import { Typography } from '@mui/material';
import ShapeTable from './components/ShapeTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-500 p-4">
        <Typography variant="h4" className="text-white">
          3D Shape Visualization and Control App
        </Typography>
      </header>
      <main className="p-4">
        <ShapeTable />
      </main>
    </div>
  );
}

export default App;
