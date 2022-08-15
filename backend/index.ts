import cors from "cors";
import express from "express";
import { createServer } from "http";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { WebSocketServer, WebSocket } from "ws";

const blockdata = new JsonDB(new Config("./blockdata", true, true, "/"))

const computers: { [id: string]: WebSocket } = {}

const app = express()
app.use(cors({ origin: true }))

app.get("/blocks", async (req, res) => {
    res.json(await blockdata.getData("/blocks"))

    res.statusCode = 200
    res.end()
})

app.get("/computers", (req, res) => {
    const ids = Object.keys(computers)
    res.json(ids)
    res.statusCode = 200
    res.end()
})

app.post("/move/:computer", async (req, res) => {
    const sock = computers[req.params.computer]
    if (!sock) {
        res.write("Computer not found")
        res.statusCode = 404
        res.end()
        return
    }
    res.json(await sendCommand(sock, "turtle.forward()"))
    res.statusCode = 200
    res.end()
})

function sendCommand(sock: WebSocket, command: string) {
    return new Promise((res, rej) => {
        const resData = (data: Buffer) => res(JSON.parse(data.toString()))
        sock.once("message", resData)
        sock.send(command)
    })
}

const server = createServer(app)
const sock = new WebSocketServer({ server })
sock.on('connection', (client, req) => {
    console.log("connect")
    if (req.headers.type === "computer" && typeof req.headers.computerid === "string") {
        computers[req.headers.computerid] = client
        console.log(`Computer: ${req.headers.computerid} connected`);
    }

    client.on('message', (data) => console.log(data.toString()));
    client.on("close", () => console.log("close"))
});

server.listen(5500, "localhost");

blockdata.push("/blocks", [{ name: "test", pos: { x: 1, y: 0, z: 0 } }])