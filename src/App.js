import React from 'react';
import { Button, Typography } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';
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
        <Button variant="contained" color="primary">
          Example Button
        </Button>
        <div className="w-full h-64 mt-4">
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, 0, 0]}>
              <meshStandardMaterial color="hotpink" />
            </Box>
          </Canvas>
        </div>
      </main>
    </div>
  );
}

export default App;
