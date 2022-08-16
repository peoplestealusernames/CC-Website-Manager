import { Object3DNode, useFrame, Vector3 } from "@react-three/fiber"
import { useRef, useState } from "react"

export function BlockRender(props: {
    position?: Vector3
}) {
    // This reference will give us direct access to the mesh
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    //@ts-ignore
    //useFrame((state: any, delta: any) => (mesh.current.rotation.x += 0.01))
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            position={props.position}
            scale={active ? 1.5 : 1}
            onClick={(event: any) => setActive(!active)}
            onPointerOver={(event: any) => setHover(true)}
            onPointerOut={(event: any) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}
