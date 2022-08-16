import { JsonDB } from "node-json-db";
import { Turtle } from "../turtleAPI/turtleTypes";



export function setupComputerSocket(db: JsonDB, computer: Turtle) {
    computer.sock.on("message", (data) => {
        const json = JSON.parse(data.toString())
        if (json.pos)
            computer.pos = json.pos
    })
}