import { WebSocket } from "ws";

export function sendCommands(sock: WebSocket, ...commands: string[]): Promise<[success: boolean, errOrRet1: string | any, ...Ret: any[]]> {
    const send = commands.map(e => `{${e}}`).join(",")
    return sendCommand(sock, send)
}

export function sendCommand(sock: WebSocket, command: string): Promise<[success: boolean, errOrRet1: string | any, ...Ret: any[]]> {
    return new Promise((res, rej) => {
        const resData = (data: Buffer) => {
            const json = JSON.parse(data.toString())

            if (json.req == command) {
                sock.off("message", resData)
                res(json.res)
            }
        }
        sock.on("message", resData)
        sock.send(command)
    })
}