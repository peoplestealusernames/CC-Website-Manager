import { Object3DNode, useFrame, useLoader, Vector3 } from "@react-three/fiber"
import { useRef, useState } from "react"
import { TextureLoader } from "three"
import { typeBlock } from "./type"

export function BlockRender(props: {
    block: typeBlock
}) {
    const colorMap = useLoader(TextureLoader, `textures/bedrock.png`)
    return (
        <mesh
            position={[props.block.pos.x, props.block.pos.y, props.block.pos.z]}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial map={colorMap} />
        </mesh>
    )
}
