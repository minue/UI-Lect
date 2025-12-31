import { Block, Dimension, Entity, EntityDamageCause, EntityItemComponent, ItemStack, world } from "@minecraft/server"
import { LogChip } from "./log_chip"

enum ACT {
    IGNORE = 0,
    ATTACK = 1,
    KIDNAP = 2,
    MINE = 3,
    BLOCK_LOG = 4,
    ENTITY_LOG = 5,
    COLLECT = 6
}


export class DataChip {

    id: string
    act: number
    dimension: Dimension
    x: number
    y: number
    z: number
    hp: number
    spider: Entity
    itemList: string[]
    filter: Object

    constructor(ent: Entity, item: ItemStack) {
        this.spider = ent
        const lore = item.getLore()
        this.act = ACT[lore[0].replace("act: ", "").toUpperCase()]
        if(this.act == ACT.COLLECT){
            this.itemList = lore.splice(1)
        }
        this.id = lore[1].replace("id: ", "")
        if(this.act == ACT.KIDNAP){
            this.dimension = world.getDimension(lore[2].replace("dimension: ", ""))
            this.x = parseInt(lore[3].replace("x: ", ""))
            this.y = parseInt(lore[4].replace("y: ", ""))
            this.z = parseInt(lore[5].replace("z: ", ""))
            this.hp = parseInt(lore[6].replace("hp: ", "") == "None" ? "-1" : lore[7].replace("x: ", ""))
        }
    }
    attack(ent: Entity) {
        if(this.spider.getProperty("watts:has_target")){
            return;
        }
        this.spider.applyDamage(0, { cause: EntityDamageCause.entityAttack, damagingEntity: ent })
        this.spider.triggerEvent("watts:has_target")
    }
    kidnap(ent: Entity) {
        ent.teleport(this, {dimension: this.dimension})
    }
    mine(block: Block) {
        const cmd: string = `/setblock ${block.x} ${block.y} ${block.z} air destroy`
    }
    blockLog(block: Block, logChip: LogChip): ItemStack {
        return logChip.addLog(LogChip.makeBlockLog(block))
    }
    entityLog(ent: Entity, logChip: LogChip): ItemStack {
        return logChip.addLog(LogChip.makeEntityLog(ent))
    }
    collect(ent: Entity) {
        if(ent.typeId != "minecraft:item") {
            return
        }
        const itemEnt: ItemStack = (ent.getComponent("minecraft:item") as EntityItemComponent).itemStack
        if(this.itemList.indexOf(itemEnt.typeId) != -1) {
            const mover= { x: ent.location.x + ((this.spider.location.x - ent.location.x) / 20), 
                y: ent.location.y + ((this.spider.location.y - ent.location.y) / 20), 
                z: ent.location.z + ((this.spider.location.z - ent.location.z) / 20) }
            ent.teleport(mover)
        }
    }
}