import cors from "cors";
import express from "express";
import { createServer } from "http";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { Server } from "socket.io";

const blockdata = new JsonDB(new Config("./blockdata", true, true, "/"))

const app = express()
app.use(cors({ origin: "http://localhost:3000" }))

app.get("/blocks", async (req, res) => {
    res.json(await blockdata.getData("/blocks"))

    res.statusCode = 200
    res.end()
})

const server = createServer(app)
const io = new Server()
io.on('connection', client => {
    console.log("connect");
    client.on('event', data => console.log(data));
    client.on('disconnect', () => console.log("dc"));

});
server.listen(5500, "localhost");

blockdata.push("/blocks", [{ name: "test", pos: { x: 1, y: 0, z: 0 } }])