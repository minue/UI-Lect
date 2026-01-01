import { Block, Dimension, Entity, EntityItemComponent, ItemStack, world } from "@minecraft/server";
import { getSpiders, Spider } from "./spider";


export function getMiner(): Entity[] {
    const overworld: Dimension = world.getDimension("overworld")
    const nether: Dimension = world.getDimension("nether")
    const the_end: Dimension = world.getDimension("the_end")
    const overworldMiner: Entity[] = overworld.getEntities({
        type: "watts:miner",
    })
    const netherMiner: Entity[] = nether.getEntities({
        type: "watts:miner",
    })
    const the_endMiner: Entity[] = the_end.getEntities({
        type: "watts:miner",
    })
    return overworldMiner.concat(netherMiner).concat(the_endMiner)
}

export class Miner{
    miner: Entity
    owner: Spider
    locX: number
    locY: number
    locZ: number

    constructor(miner: Entity, owner: Spider) {
        this.miner = miner
        this.setOwner(owner)
    }
    setOwner(spider: Spider) {
        this.owner = spider
    }
    mine(block: Block) {
        const distance = Math.sqrt((this.miner.location.x - block.x) ^ 2 + 
            (this.miner.location.y - block.y) ^ 2 + 
            (this.miner.location.z - block.z) ^ 2)
        const cmd: string = `/setblock ${block.x} ${block.y} ${block.z} air destroy`
        if(distance < 2){
            this.miner.runCommand(cmd)
        }
    }
    collect(ent: Entity, itemName: string) {
        const distance = Math.sqrt((this.miner.location.x - ent.location.x) ^ 2 + 
            (this.miner.location.y - ent.location.y) ^ 2 + 
            (this.miner.location.z - ent.location.z) ^ 2)
        if(ent.typeId != "minecraft:item" || distance > 5) {
            return
        }
        const itemEnt: ItemStack = (ent.getComponent("minecraft:item") as EntityItemComponent).itemStack
        if(itemEnt.typeId == itemName) {
            const mover= { x: ent.location.x + ((this.miner.location.x - ent.location.x) / 20), 
                y: ent.location.y + ((this.miner.location.y - ent.location.y) / 20), 
                z: ent.location.z + ((this.miner.location.z - ent.location.z) / 20) }
            ent.teleport(mover)
        }
    }
}