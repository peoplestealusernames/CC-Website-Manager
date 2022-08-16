import React, { useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas, Camera, useThree } from '@react-three/fiber';
import { BlockRender } from './Block';
import axios from 'axios';
import { typeBlock, typeComputer } from './type';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

function App() {
  const [blocks, setblocks] = useState<typeBlock[]>([])

  useMemo(() =>
    axios.get(`http://localhost:5500/blocks`)
      .then(response => {
        const data = response.data as { [x: string]: typeBlock }
        setblocks(Object.values(data))
      }, error => {
        console.log(error);
      })
    , [])

  const [computers, setcomputers] = useState<typeComputer[]>([])

  useMemo(() =>
    axios.get(`http://localhost:5500/computers`)
      .then(response => {
        const data = response.data as { [id: string]: typeComputer }
        setcomputers(Object.values(data))
      }, error => {
        console.log(error);
      })
    , [])

  return (
    <div className="App">
      <div style={{
        width: "100vw",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
        alignContent: "center",
      }}>
        {computers.map((e, i) =>
          <button key={i} onClick={() => { }}>
            {e.id}
          </button>
        )}
      </div>
      <Canvas
        style={{ position: "absolute", width: "100%", height: "100%" }}
        camera={{ position: [-10, 0, 0], near: 5, far: 200 }}
      >
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <pointLight position={[-10, 100, 100]} intensity={2} />
        <BlockRender position={[0, 0, 0]} />
        {blocks.map((e, i) => <BlockRender key={i} position={[e.pos.x, e.pos.y, e.pos.z]} />)}
      </Canvas>
    </div>
  );
}

export default App;

// 1 1 1 1
// 8 4 2 1