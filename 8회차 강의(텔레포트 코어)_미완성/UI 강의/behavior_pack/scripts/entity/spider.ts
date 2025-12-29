import { Block, BlockType, BlockTypes, Container, Dimension, DimensionType, DimensionTypes, Entity, EntityComponentTypes, EntityDamageCause, EntityHealthComponent, EntityHurtAfterEvent, EntityInventoryComponent, EntityTameableComponent, ItemStack, Player, PlayerInteractWithEntityAfterEvent, world } from "@minecraft/server";


enum ACT {
    IGNORE = 0,
    ATTACK = 1,
    KIDNAP = 2,
    MINE = 3,
    MARK = 4
}

enum TYPE {
    BLOCK = 0,
    ENTITY = 1,
    PLACE = 2
}

function getSpiders(player: Player) {
    const dimension: Dimension = player.dimension
    const spider: Entity[] = dimension.getEntities({
        type: "watts:electric_spider_alt",
    })
    const spiderBig: Entity[] = dimension.getEntities({
        type: "watts:electric_spider_alt_big",
    })
    return spider.concat(spiderBig)
}

function getSlave(player: Player) {
    const spiders: Entity[] = getSpiders(player)
    const result: Entity[] = []
    spiders.forEach(spider => {
        const tame = spider.getComponent(EntityComponentTypes.Tameable) as EntityTameableComponent
        if (tame.tamedToPlayerId == player.id) {
            result.push(spider)
        }
    });
    return result
}

export function spiderInteract(ev: PlayerInteractWithEntityAfterEvent){
    if(!ev.itemStack){
        return;
    }
    if(ev.itemStack.typeId.startsWith("watts:remote")){
        
    }
}

export function getSlaveSorted(player: Player) {
    const slaveNum = world.scoreboard.getObjective("slaveNum")
    const slave = getSlave(player)
    const result: Entity[] = []
    slave.forEach((spider) => {
        const num = slaveNum!.getScore(spider.scoreboardIdentity!)!
        if(num > 0){
            result.push(spider)
        }
    })
    result.sort((a, b) => {
        const aNum = slaveNum!.getScore(a.scoreboardIdentity!)!
        const bNum = slaveNum!.getScore(b.scoreboardIdentity!)!
        return aNum - bNum
    })
}

class Log {
    id: string
    dimension: Dimension
    x: number
    y: number
    z: number
    constructor(id: string, x: number, y: number, z: number, dimension: string) {
        this.x = x
        this.y = y
        this.z = z
        this.id = id
        this.dimension = world.getDimension(dimension)
    }
    checkNearest(){
        this.dimension.getBlockAbove(this,{includePassableBlocks: true})
    }
    teleport(player: Player) {
        player.teleport(this, {dimension: this.dimension})
    }
}

class DataChip {

    type: number
    id: string
    act: number
    x: number
    y: number
    z: number
    hp: number

    constructor(item: ItemStack) {
        const lore = item.getLore()
        this.type = ACT[lore[0].replace("mode: ", "")]
        this.id = lore[1].replace("id: ", "")
        this.act = ACT[lore[2]].replace("act: ", "")
        this.x = parseInt(lore[3].replace("x: ", "") == "None" ? "0" : lore[3].replace("x: ", ""))
        this.y = parseInt(lore[4].replace("y: ", "") == "None" ? "0" : lore[4].replace("x: ", ""))
        this.z = parseInt(lore[5].replace("z: ", "") == "None" ? "0" : lore[5].replace("x: ", ""))
        this.hp = parseInt(lore[6].replace("hp: ", "") == "None" ? "-1" : lore[6].replace("x: ", ""))
    }

    setLog(item: ItemStack, str: string): ItemStack{
        const log: string[] = item.getLore()
        if(log.length > 50) {
            return item
        }
        log.push(str)
        item.setLore(log)
        return item
    }

    getLog(item: ItemStack): string[] {
        const log: string[] = item.getLore()
        return log.slice(7)
    }

    makeLogStr(block: Block): string{
        if(block.typeId == this.id){
            const str = `x: ${block.x}/y: ${block.y}/z: ${block.z}/type: ${block.typeId}/dimension: ${block.dimension.id}`
            return str
        }
        return ""
    }

    logInterpret(str: string): Log {
        const log: string[] = str.split("/")
        const x = parseFloat(log[0].replace("x: ", ""))
        const y = parseFloat(log[1].replace("y: ", ""))
        const z = parseFloat(log[2].replace("z: ", ""))
        const typeid = log[3].replace("type: ", "")
        const dimension = log[4].replace("dimension: ", "")
        return new Log(typeid, x,y,z,dimension)
    }
}

class React {
    strArr: string[]
    spider: Entity

    constructor(str: string) {
    }

    basicEntityReact(ev: PlayerInteractWithEntityAfterEvent) {
        const container: Container = (ev.target.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container
        let react: string[]
        for(let index = 0 ; index < container.size; index++){
            let itemStack = container.getItem(index);
            if(itemStack?.typeId != "watts:data_chip"){
                continue
            }
            container.getItem
        }
    }

    spiderAct(ent: Entity) {
    }
    spiderAttack(ent: Entity) {
        if(this.spider.getProperty("watts:has_target")){
            return;
        }
        this.spider.applyDamage(0, { cause: EntityDamageCause.entityAttack, damagingEntity: ent })
        this.spider.triggerEvent("watts:has_target")
    }
    spiderKidnap(ent: Entity) {
    }

    attackEvent(ev: EntityHurtAfterEvent) {
        this.spiderAct(ev.hurtEntity)
    }
}
