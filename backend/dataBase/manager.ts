import { JsonDB } from "node-json-db"
import { xyz } from "../posManager";
import { block } from "./DBtypes"



export async function UpdateBlocks(db: JsonDB, ...blocks: block[]) {
    for (const block of blocks) {
        await db.push(`/blocks/${block.pos.x},${block.pos.y},${block.pos.z}`, block, true)
    };
}