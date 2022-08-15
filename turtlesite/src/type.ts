export type typeComputer = {
    type: "turtle"
    pos: typexyz
    id: string
}

export type typeBlock = {
    name: string,
    pos: typexyz
}

export type typexyz = { x: number, y: number, z: number }