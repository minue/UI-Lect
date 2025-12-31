import { Container, Dimension, Entity, EntityComponentTypes, EntityHurtAfterEvent, EntityInventoryComponent, EntityTameableComponent, Player, PlayerInteractWithEntityAfterEvent, world } from "@minecraft/server";
import { DataChip } from "../item/chip/data_chip";
import { LogChip } from "../item/chip/log_chip";



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

class React {
    spider: Entity
    dataChip: DataChip[] = []
    logChip: LogChip[] = []

    constructor(ent: Entity) {
        this.spider = ent
        this.loadDataChip()
    }
    loadDataChip() {
        const container: Container = (this.spider.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container
        for(let index = 0 ; index < container.size; index++){
            let itemStack = container.getItem(index);
            if(itemStack?.typeId != "watts:data_chip"){
                continue
            }
            this.dataChip.push(new DataChip(this.spider, container.getItem(index)!))
        }
    }
    loadLogChip() {
        const container: Container = (this.spider.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container
        for(let index = 0 ; index < container.size; index++){
            let itemStack = container.getItem(index);
            if(itemStack?.typeId != "watts:log_chip"){
                continue
            }
            this.logChip.push(new LogChip(this.spider, container, index, container.getItem(index)!))
        }
    }
}
