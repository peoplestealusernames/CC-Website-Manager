import { JsonDB } from "node-json-db"
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { xyz } from "../posManager";
import { block } from "./DBtypes"

const dataBase = new JsonDB(new Config("./database", true, true, "/"))

export async function UpdateBlocks(...blocks: block[]) {
    for (const block of blocks) {
        const path = `/blocks/${block.pos.x},${block.pos.y},${block.pos.z}`
        if (block.name)
            await dataBase.push(path, block, true)
        else
            await dataBase.delete(path)
    };
}

export function GetAllBlocks() {
    return dataBase.getData("/blocks/")
}