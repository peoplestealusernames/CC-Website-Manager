

export type xyz = {
    x: number
    y: number
    z: number
}

export function addPos(a: xyz, b: xyz): xyz {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}