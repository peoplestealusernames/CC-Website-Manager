import cors from "cors";
import express from "express";
import { createServer } from "http";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { WebSocketServer, WebSocket } from "ws";
import { sendCommand, sendCommands } from "./computerAPI/sendCommands";
import { setupComputerSocket } from "./computerAPI/socketSetup";
import { GetAllBlocks } from "./dataBase/manager";
import { Forward, Left, Right, updateSurroundings } from "./turtleAPI/movement";
import { Turtle } from "./turtleAPI/turtleTypes";

const computers: { [id: string]: Turtle } = {}

const app = express()
app.use(cors({ origin: true }))

app.get("/blocks", async (req, res) => {
    res.json(await GetAllBlocks())

    res.statusCode = 200
    res.end()
})

app.get("/computers", (req, res) => {
    const post = Object.values(computers).map(e => { return { ...e, sock: null } })
    res.json(post)
    res.statusCode = 200
    res.end()
})

app.post("/move/:computer", async (req, res) => {
    const turtle = computers[req.params.computer]
    if (!turtle) {
        res.write("Computer not found")
        res.statusCode = 404
        res.end()
        return
    }
    res.json(await Forward(turtle))
    res.statusCode = 200
    res.end()
})

app.post("/left/:computer", async (req, res) => {
    const turtle = computers[req.params.computer]
    if (!turtle) {
        res.write("Computer not found")
        res.statusCode = 404
        res.end()
        return
    }
    res.json(await Left(turtle))
    res.statusCode = 200
    res.end()
})

app.post("/right/:computer", async (req, res) => {
    const turtle = computers[req.params.computer]
    if (!turtle) {
        res.write("Computer not found")
        res.statusCode = 404
        res.end()
        return
    }
    res.json(await Right(turtle))
    res.statusCode = 200
    res.end()
})

app.get("/surround/:computer", async (req, res) => {
    const turtle = computers[req.params.computer]
    if (!turtle) {
        res.write("Computer not found")
        res.statusCode = 404
        res.end()
        return
    }
    res.json(await sendCommands(turtle.sock, "turtle.inspectUp()", "turtle.inspect()", "turtle.inspectDown()"))
    res.statusCode = 200
    res.end()
})

app.post("/raw/:computer/:command", async (req, res) => {
    const turtle = computers[req.params.computer]
    if (!turtle) {
        res.write("Computer not found")
        res.statusCode = 404
        res.end()
        return
    }
    res.json(await sendCommand(turtle.sock, req.params.command))
    res.statusCode = 200
    res.end()
})

const server = createServer(app)
const sock = new WebSocketServer({ server })
sock.on('connection', (client, req) => {
    console.log("connect")
    if (req.headers.type === "computer" && typeof req.headers.computerid === "string") {
        const pos = JSON.parse(req.headers.pos as string)
        computers[req.headers.computerid] = { type: "turtle", sock: client, pos, id: req.headers.computerid, dir: parseInt(req.headers.dir as string) }
        setupComputerSocket(computers[req.headers.computerid])
        console.log(`Computer: ${req.headers.computerid} connected`);
    }
    client.on("close", () => console.log("close"))
});

server.listen(5500, "localhost");