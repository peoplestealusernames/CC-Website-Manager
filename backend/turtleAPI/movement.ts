import { JsonDB } from "node-json-db";
import { WebSocket } from "ws";
import { sendCommands } from "../computerAPI/sendCommands";
import { block } from "../dataBase/DBtypes";
import { UpdateBlocks } from "../dataBase/manager";
import { addPos, xyz } from "../posManager";
import { Turtle } from "./turtleTypes";

export function forward(db: JsonDB, turtle: Turtle) {

}

export async function updateSurroundings(db: JsonDB, turtle: Turtle) {
    const blocks = await getSurroundings(turtle)
    const offsets: xyz[] = [{ x: 0, y: 1, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }]

    const newBlocks = blocks.splice(1).map((e, i): block => {
        e = e[1]
        return {
            name: e.name,
            pos: addPos(turtle.pos, offsets[i])
        }
    })

    UpdateBlocks(db, ...newBlocks)
}

export function getSurroundings(turtle: Turtle) {
    return sendCommands(turtle.sock, "turtle.inspectUp()", "turtle.inspect()", "turtle.inspectDown()")
}