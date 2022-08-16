import { JsonDB } from "node-json-db";
import { updateSurroundings } from "../turtleAPI/movement";
import { Turtle } from "../turtleAPI/turtleTypes";



export function setupComputerSocket(computer: Turtle) {
    computer.sock.on("message", (data) => {
        const json = JSON.parse(data.toString())

        if (json.pos)
            computer.pos = json.pos
        if (json.dir)
            computer.dir = json.dir
        if (json.surrounding)
            updateSurroundings(computer, json.surrounding)
    })
}