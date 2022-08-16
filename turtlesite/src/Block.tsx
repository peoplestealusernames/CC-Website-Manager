import { useTexture } from "@react-three/drei"
import { Object3DNode, useFrame, Vector3 } from "@react-three/fiber"
import { useRef, useState } from "react"
import { Texture } from "three"
import { textureMap } from "./texturemap"
import { typeBlock } from "./type"

export function BlockRender(props: {
    block: typeBlock
}) {
    let pngname = `${props.block.name.split(":").splice(1).join(":")}`
    if (!Object.hasOwn(textureMap, pngname)) {
        console.error(`Missing texture: "${pngname}"`)
        pngname = "null"
    }

    const [colorMap, nullmap] = useTexture([`textures/${pngname}.png`, "textures/null.png"])

    return (
        <mesh
            position={[props.block.pos.x, props.block.pos.y, props.block.pos.z]}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial map={colorMap ? colorMap : nullmap} />
        </mesh>
    )
}
