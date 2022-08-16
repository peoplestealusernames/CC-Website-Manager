import React, { createRef, useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas, Camera, useThree } from '@react-three/fiber';
import { BlockRender } from './Block';
import axios from 'axios';
import { typeBlock, typeComputer, typexyz } from './type';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { RenderTurtle } from './Turtle';
import { CameraMover } from './cameraMover';

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
  const [pos, setpos] = useState<typexyz>({ x: 0, y: 60, z: 0 })

  useMemo(() =>
    axios.get(`http://localhost:5500/computers`)
      .then(response => {
        const data = response.data as { [id: string]: typeComputer }
        setcomputers(Object.values(data))
      }, error => {
        console.log(error);
      })
    , [])

  const ws = useMemo(() => {
    const ws = new WebSocket("ws://localhost:5500/listner")
    ws.addEventListener("open", () => console.log("open"))
    return ws
  }, [])

  function wsMessage(data: MessageEvent<any>) {
    const updatedBlock = JSON.parse(data.data) as typeBlock

    const i = blocks.findIndex((block) => xyzEqual(block.pos, updatedBlock.pos))
    console.log(updatedBlock, i, !!updatedBlock.name);
    if (i > 0)
      if (updatedBlock.name)
        blocks[i] = updatedBlock
      else
        blocks.splice(i, 1)
    else if (updatedBlock.name)
      blocks.push(updatedBlock)

    setblocks([...blocks])
  }

  useEffect(() => {
    ws.addEventListener("message", wsMessage)

    return () => ws.removeEventListener("message", wsMessage)
  }, [ws, wsMessage])

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
          <button key={i} onClick={() => setpos({ x: e.pos.x - 10, y: e.pos.y, z: e.pos.z })}>
            {e.id}
          </button>
        )}
      </div>
      <Canvas
        style={{ position: "absolute", width: "100%", height: "100%" }}
        camera={{ position: [pos.x, pos.y, pos.z], near: 1, far: 400 }}
      >
        <OrbitControls target={[pos.x + 1, pos.y, pos.z]} enablePan={true} enableZoom={true} enableRotate={true} />
        <pointLight position={[-10, 100, 100]} intensity={2} />
        <CameraMover pos={pos} />
        {blocks.map((e, i) => <BlockRender key={i} block={e} />)}
        {computers.map((e, i) => <RenderTurtle key={i} turtle={e} />)}
      </Canvas>
    </div>
  );
}

export default App;

function xyzEqual(a: typexyz, b: typexyz) {
  return a.x === b.x &&
    a.y === b.y &&
    a.z === b.z
}

// 1 1 1 1
// 8 4 2 1