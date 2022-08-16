import { WebSocket } from "ws"
import { xyz } from "../posManager"

export type Turtle = {
    type: "turtle"
    pos: xyz
    dir: number
    sock: WebSocket
    id: string
}