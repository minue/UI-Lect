import { Block, Entity, ItemStack, world } from "@minecraft/server";
import { Miner } from "../../entity/miner";
import { Spider } from "../../entity/spider";

export enum Type {
    NONE,
    ENTITY,
    BLOCK
}

export class MinerChip {
    miner: Miner
    item: ItemStack
    id: string | undefined
    block: Block | undefined
    constructor (spider: Spider, index: number) {
        this.item = spider.container.getItem(index)!
    }
    setEntTarget(ent: Entity) {
        this.item.setLore([`ent ${ent.id}`])
    }
    setBlockTarget(block: Block) {
        this.item.setLore([`block ${block.x} ${block.y} ${block.z} ${block.dimension.id}`])
    }
    targetReset() {
        this.item.setLore()
    }
    getTargetType(){
        if(this.item.getLore()[0].startsWith("ent")) {
            return Type.ENTITY
        }
        if(this.item.getLore()[0].startsWith("block")) {
            return Type.BLOCK
        }
        return Type.NONE
    }
    getBlockTarget(): Block|undefined {
        const loc: string[] = this.item.getLore()[0].replace("block ", "").split(" ")
        const x: number = parseFloat(loc[0])
        const y: number = parseFloat(loc[1])
        const z: number = parseFloat(loc[2])
        const dimension = world.getDimension(loc[3])
        if(dimension.getBlock({x: x, y: y, z: z}) == undefined) {
            this.targetReset()
        }
        return dimension.getBlock({x: x, y: y, z: z})
    }
    getEntityTarget(): Entity|undefined {
        if(world.getEntity(this.item.getLore()[0].replace("ent ", "")) == undefined) {
            this.targetReset()
        }
        return world.getEntity(this.item.getLore()[0].replace("ent ", ""))
    }
}