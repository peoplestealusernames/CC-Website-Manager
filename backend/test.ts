
import { WebSocket } from "ws"

const ws = new WebSocket("ws://localhost:5500")

ws.on("open", () => console.log("open"))
ws.on("message", (ws, data) => console.log(data))