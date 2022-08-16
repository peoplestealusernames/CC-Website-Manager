import { JsonDB } from "node-json-db";
import { WebSocket } from "ws";
import { sendCommand, sendCommands } from "../computerAPI/sendCommands";
import { block } from "../dataBase/DBtypes";
import { UpdateBlocks } from "../dataBase/manager";
import { addPos, xyz } from "../posManager";
import { Turtle } from "./turtleTypes";

export async function Forward(turtle: Turtle) {
    const [compile, result, err] = await sendCommand(turtle.sock, "Forward()")
    if (!compile)
        throw new Error(result)
    return [result, err]
}


export async function Right(turtle: Turtle) {
    const [compile, result, err] = await sendCommand(turtle.sock, "Right()")
    if (!compile)
        throw new Error(result)
    return [result, err]
}

export async function Left(turtle: Turtle) {
    const [compile, result, err] = await sendCommand(turtle.sock, "Left()")
    if (!compile)
        throw new Error(result)
    return [result, err]
}

export async function updateSurroundings(turtle: Turtle) {
    const blocks = await getSurroundings(turtle)
    const offsets: xyz[] = [{ x: 0, y: 1, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }]

    const newBlocks = blocks.splice(1).map((e, i): block => {
        e = e[1]
        return {
            name: e.name,
            pos: addPos(turtle.pos, offsets[i])
        }
    })

    UpdateBlocks(...newBlocks)
}

export function getSurroundings(turtle: Turtle) {
    return sendCommands(turtle.sock, "turtle.inspectUp()", "turtle.inspect()", "turtle.inspectDown()")
}