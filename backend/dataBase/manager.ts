import { JsonDB } from "node-json-db"
import { xyz } from "../posManager";
import { block } from "./DBtypes"



export async function UpdateBlocks(db: JsonDB, ...blocks: block[]) {
    for (const block of blocks) {
        const path = `/blocks/${block.pos.x},${block.pos.y},${block.pos.z}`
        if (block.name)
            await db.push(path, block, true)
        else
            await db.delete(path)
    };
}