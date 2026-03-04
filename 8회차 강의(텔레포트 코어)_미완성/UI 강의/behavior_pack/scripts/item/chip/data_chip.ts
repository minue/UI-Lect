import { Block, BlockInventoryComponent, BlockLocationIterator, BlockVolume, Dimension, Entity, EntityDamageCause, EntityItemComponent, EntityRideableComponent, ItemStack, ListBlockVolume, Vector3, world } from "@minecraft/server"
import { Spider } from "../../entity/spider"
import { Utills } from "../../Utills/Utills"

export enum ACT {
    IGNORE = 0,
    ATTACK = 1,
    KIDNAP = 2,
    MINE = 3,
    BLOCK_LOG = 4,
    COLLECT = 5
}


export class DataChip {

    id: string
    item: ItemStack
    act: number
    dimension: Dimension
    x: number
    y: number
    z: number
    minX: number
    minY: number
    minZ: number
    maxX: number
    maxY: number
    maxZ: number
    hp: number
    spider: Spider
    pointer: Entity | undefined
    itemList: string[]
    filter: Object
    kidnapEnt: Entity

    constructor(spider: Spider, item: ItemStack) {
        this.spider = spider
        this.item = item
        const lore = item.getLore()
        this.act = ACT[lore[0].replace("act: ", "").toUpperCase()]
        if (this.act == ACT.COLLECT) {
            this.itemList = lore.splice(1)
        }
        this.id = lore[1].replace("id: ", "")
        if (this.act == ACT.KIDNAP) {
            this.dimension = world.getDimension(lore[2].replace("dimension: ", ""))
            this.x = parseFloat(lore[3].replace("x: ", ""))
            this.y = parseFloat(lore[4].replace("y: ", ""))
            this.z = parseFloat(lore[5].replace("z: ", ""))
            this.hp = parseInt(lore[6].replace("hp: ", "") == "None" ? "-1" : lore[7].replace("x: ", ""))
        }
    }
    findBlock() {
        const from = {
            x: this.spider.spider.location.x - 5,
            y: this.spider.spider.location.y - 100,
            z: this.spider.spider.location.z - 5
        }
        const to = {
            x: this.spider.spider.location.x + 5,
            y: this.spider.spider.location.y + 100,
            z: this.spider.spider.location.z + 5
        }
        return this.spider.spider.dimension.containsBlock(new BlockVolume(from, to), { includeTypes: [this.id] })
    }
    dataAct(nearEntity: Entity[]) {
        if (this.act == ACT.ATTACK) {
            nearEntity.forEach(ent => {
                if (ent.typeId == this.id) {
                    this.spider.react.targetEntity = ent
                }
            });
            this.attack(this.spider.react.targetEntity)
        } else if (this.act == ACT.KIDNAP) {
            nearEntity.forEach(ent => {
                if (ent.typeId == this.id) {
                    this.kidnapEnt = ent
                }
            });
            this.kidnap(this.kidnapEnt)
        } else if ((this.act == ACT.MINE || this.act == ACT.BLOCK_LOG) && this.findBlock()) {
            for (let x = -5; x < 5; x++) {
                for (let y = -100; y < 100; y++) {
                    for (let z = -5; z < 5; z++) {
                        const loc = {
                            x: this.spider.spider.location.x + x,
                            y: this.spider.spider.location.y + y,
                            z: this.spider.spider.location.z + z
                        }
                        const block = this.spider.spider.dimension.getBlock(loc)
                        if (this.act == ACT.MINE && block?.typeId == this.id) {
                            this.mine(block)
                        }
                        if (this.act == ACT.BLOCK_LOG && block?.typeId == this.id) {
                            this.log(block)
                        }
                    }
                }
            }
        } else if (this.act == ACT.COLLECT) {
            nearEntity.forEach(ent => {
                if (ent.typeId == "minecraft:item") {
                    const itemEnt: ItemStack = (ent.getComponent("minecraft:item") as EntityItemComponent).itemStack
                    if (this.itemList.includes(itemEnt.typeId)) {
                        this.collect(ent)
                    }
                }
            });
        }
    }
    attack(ent: Entity) {
        if (this.spider.spider.getProperty("watts:has_target")) {
            return;
        }
        this.spider.spider.applyDamage(0, { cause: EntityDamageCause.entityAttack, damagingEntity: ent })
        this.spider.spider.triggerEvent("watts:has_target")
    }
    kidnap(ent: Entity) {
        ent.teleport(this, { dimension: this.dimension })
    }
    mine(block: Block) {
        if (this.spider.react.targetBlock.includes(block)) {
            return
        }
        this.spider.react.targetBlock.push(block)
    }
    log(block: Block) {
        let logChip = this.spider.react.logChip
        for (let i = 0; i < logChip.length; i++) {
            if (logChip[i].canWrite()) {
                logChip[i].blockLog(block)
            }
        }
    }
    collect(ent: Entity) {
        this.spider.react.targeItemEnt.push(ent)
    }
}