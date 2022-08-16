import { Object3DNode, useFrame, Vector3 } from "@react-three/fiber"
import { useRef, useState } from "react"

export function BlockRender(props: {
    position?: Vector3
}) {
    return (
        <mesh
            position={props.position}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}
