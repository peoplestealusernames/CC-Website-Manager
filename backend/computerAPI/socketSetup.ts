import { JsonDB } from "node-json-db";
import { Turtle } from "../turtleAPI/turtleTypes";



export function setupComputerSocket(computer: Turtle) {
    computer.sock.on("message", (data) => {
        const json = JSON.parse(data.toString())
        if (json.pos)
            computer.pos = json.pos
    })
}