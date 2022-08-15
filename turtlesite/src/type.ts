export type typeComputer = {
    type: "turtle"
    pos: typexyz
    sock: WebSocket
}

export type typeBlock = {
    name: string,
    pos: typexyz
}

export type typexyz = { x: number, y: number, z: number }