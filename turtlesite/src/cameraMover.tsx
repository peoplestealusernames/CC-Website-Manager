import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { typexyz } from "./type";


export function CameraMover(props: {
    pos?: typexyz
}) {
    const [pos, setpos] = useState<undefined | typexyz>(props.pos)

    console.log(pos);
    useEffect(() => {
        setpos(props.pos)
    }, [props.pos])


    useFrame(({ camera }) => {
        if (pos) {
            camera.position.set(pos.x, pos.y, pos.z)
            setpos(undefined)
        }
    })

    return <></>
}