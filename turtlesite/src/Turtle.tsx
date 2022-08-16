import { typeComputer } from "./type";


export function RenderTurtle(props: {
    turtle: typeComputer
}) {

    return <mesh
        position={[props.turtle.pos.x, props.turtle.pos.y, props.turtle.pos.z]}
        scale={.75}
    >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"orange"} />
    </mesh>
}