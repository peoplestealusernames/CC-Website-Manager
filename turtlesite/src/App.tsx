import React, { useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { Box } from './three';
import axios from 'axios';

type typeBlock = { name: string, pos: { x: number, y: number, z: number } }

function App() {
  const [blocks, setblocks] = useState<typeBlock[]>([])

  useMemo(() =>
    axios.get(`http://localhost:5500/blocks`)
      .then(response => {
        const data = response.data as typeBlock[]
        console.log(data);
        setblocks(data)
      }, error => {
        console.log(error);
      })
    , [])

  return (
    <div className="App">
      <Canvas style={{ position: "absolute", width: "100%", height: "100%" }}>
        <pointLight position={[10, 10, 10]} />
        {blocks.map((e, i) => <Box key={i} position={[e.pos.x, e.pos.y, e.pos.z]} />)}
      </Canvas>,
    </div>
  );
}

export default App;

// 1 1 1 1
// 8 4 2 1