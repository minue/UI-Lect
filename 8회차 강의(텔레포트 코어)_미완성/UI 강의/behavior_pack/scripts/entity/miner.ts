import { Block, Container, Dimension, Entity, EntityInventoryComponent, EntityItemComponent, ItemStack, Vector3, world } from "@minecraft/server";
import { getSpiders, Spider } from "./spider";
import { Utills } from "../Utills/Utills";


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
    container: Container
    owner: Spider
    locX: number
    locY: number
    locZ: number

    constructor(miner: Entity, owner: Spider) {
        this.miner = miner
        this.container = (miner.getComponent("minecraft:inventory") as EntityInventoryComponent).container
        this.setOwner(owner)
    }
    public static spawn(spider: Spider, block: Block){
        const miner = spider.spider.dimension.spawnEntity("watts:miner", spider.spider.location)
        return new Miner(miner, spider)
    }
    setOwner(spider: Spider) {
        this.owner = spider
    }
    move(loc: Vector3) {
        const distance = Utills.distance(loc, this.miner.location)
        const vec = {x: (loc.x - this.miner.location.x) / distance,
            y: (loc.y - this.miner.location.y)  / distance,
            z: (loc.z - this.miner.location.z)  / distance
        }
        this.miner.applyImpulse(vec)
    }
    mine(block: Block) {
        const distance = Math.sqrt((this.miner.location.x - block.x) ^ 2 + 
            (this.miner.location.y - block.y) ^ 2 + 
            (this.miner.location.z - block.z) ^ 2)
        const cmd: string = `/setblock ${block.x} ${block.y} ${block.z} air destroy`
        if(distance < 2){
            this.miner.runCommand(cmd)
            const del = this.owner.react.targetBlock.indexOf(block)
            const before = this.owner.react.targetBlock.slice(0, del - 1)
            const after = this.owner.react.targetBlock.slice(del - 1)
            this.owner.react.targetBlock = before.concat(after)
            return
        }
        this.move(block)
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
            this.container.addItem(itemEnt)
            const before = this.owner.react.targeItemEnt.splice(0, this.owner.react.targeItemEnt.indexOf(ent) - 1)
            const after = this.owner.react.targeItemEnt.splice(this.owner.react.targeItemEnt.indexOf(ent) + 1)
            this.owner.react.targeItemEnt = before.concat(after)
            ent.remove()
            return
        }
        this.move(ent.location)
    }
}