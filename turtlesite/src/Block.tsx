import { Object3DNode, useFrame, Vector3 } from "@react-three/fiber"
import { useRef, useState } from "react"
import { typeBlock } from "./type"

export function BlockRender(props: {
    block: typeBlock
}) {
    return (
        <mesh
            position={[props.block.pos.x, props.block.pos.y, props.block.pos.z]}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}
