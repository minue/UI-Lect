import { Block, Container, Dimension, Entity, EntityComponentTypes, EntityInventoryComponent, EntityTameableComponent, ListBlockVolume, Player, PlayerInteractWithEntityAfterEvent, ScoreboardObjective, world } from "@minecraft/server";
import { ACT, DataChip } from "../item/chip/data_chip";
import { LogChip } from "../item/chip/log_chip";
import { getMiner, Miner } from "./miner";



export function getSpiders(): Entity[] {
    const overworld: Dimension = world.getDimension("overworld")
    const nether: Dimension = world.getDimension("nether")
    const the_end: Dimension = world.getDimension("the_end")
    const overworldSpider: Entity[] = overworld.getEntities({
        type: "watts:electric_spider_alt",
    })
    const overworldSpiderBig: Entity[] = overworld.getEntities({
        type: "watts:electric_spider_alt_big",
    })
    const netherSpider: Entity[] = nether.getEntities({
        type: "watts:electric_spider_alt",
    })
    const netherSpiderBig: Entity[] = nether.getEntities({
        type: "watts:electric_spider_alt_big",
    })
    const the_endSpider: Entity[] = the_end.getEntities({
        type: "watts:electric_spider_alt",
    })
    const the_endSpiderBig: Entity[] = the_end.getEntities({
        type: "watts:electric_spider_alt_big",
    })
    return overworldSpider.concat(overworldSpiderBig)
        .concat(netherSpider).concat(netherSpiderBig)
        .concat(the_endSpider).concat(the_endSpiderBig)
}

function getSlave(player: Player) {
    const spiders: Entity[] = getSpiders()
    const result: Entity[] = []
    spiders.forEach(spider => {
        const tame = spider.getComponent(EntityComponentTypes.Tameable) as EntityTameableComponent
        if (tame.tamedToPlayerId == player.id) {
            result.push(spider)
        }
    });
    return result
}

function getSlaveMiner(spider: Spider) {
    const miners = getMiner()
    const result: Miner[] = []
    miners.forEach((miner) => {
        if (spider.spider.getDynamicProperty("watts:serial_number") == miner.getDynamicProperty("watts:parent_serial_number")) {
            result.push(new Miner(miner, spider))
        }
    })
    return result
}

export function spiderInteract(ev: PlayerInteractWithEntityAfterEvent) {
    if (!ev.itemStack) {
        return;
    }
    if (ev.itemStack.typeId.startsWith("watts:remote")) {

    }
}

export function getSlaveSorted(player: Player) {
    const slaveNum = world.scoreboard.getObjective("slaveNum")
    const slave = getSlave(player)
    const result: Entity[] = []
    slave.forEach((spider) => {
        const num = slaveNum!.getScore(spider.scoreboardIdentity!)!
        if (num > 0) {
            result.push(spider)
        }
    })
    result.sort((a, b) => {
        const aNum = slaveNum!.getScore(a.scoreboardIdentity!)!
        const bNum = slaveNum!.getScore(b.scoreboardIdentity!)!
        return aNum - bNum
    })
}

export class Spider {
    spider: Entity
    react: React
    miners: Miner[] = []
    container: Container
    buildMode: boolean = false

    constructor(spider: Entity) {
        this.spider = spider
        this.miners = getSlaveMiner(this)
        this.react = new React(this)
        this.container = (this.spider.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container

    }
    spawnMiner() {
        this.miners.push(Miner.spawn(this, this.react.targetBlock[0]))
    }
    despawnMiner(miner: Miner) {
        miner.miner.remove()
    }
    haveItemCount(item: string) {
        let count = 0;
        for (let i = 0; i < this.container.size; i++) {
            if (this.container.getItem(i)?.typeId == item) {
                count += this.container.getItem(i)!.amount
            }
        }
        return count
    }
    removeItem(item: string, count: number = 1): boolean {
        if (this.haveItemCount(item) < count) {
            return false;
        }
        this.spider.runCommand(`/clear @s ${item} -1 ${count}`)
        return true;
    }
    getPower(): number {
        const objective: ScoreboardObjective = world.scoreboard.getObjective("energy")!
        return objective.getScore(this.spider)!
    }
    getMaxPower(): number {
        const objective: ScoreboardObjective = world.scoreboard.getObjective("maxEnergy")!
        return objective.getScore(this.spider)!
    }
    setPower(num: number) {
        const objective: ScoreboardObjective = world.scoreboard.getObjective("energy")!
        objective.setScore(this.spider, (num > this.getMaxPower()) ? this.getMaxPower() : num)
    }
    setMaxPower(num: number) {
        const objective: ScoreboardObjective = world.scoreboard.getObjective("maxEnergy")!
        objective.setScore(this.spider, num)
    }
}

class React {
    spider: Spider
    dataChip: DataChip[] = []
    logChip: LogChip[] = []
    targetBlock: Block[]
    targeItemEnt: Entity[]
    nearEntity: Entity[]
    nearBlock: ListBlockVolume
    targetEntity: Entity

    constructor(spider: Spider) {
        this.spider = spider
        this.loadDataChip()
        this.loadLogChip()
    }
    act() {
        if (this.spider.buildMode) {
            let build: DataChip
            this.dataChip.forEach((data) => {
                if (data.act == ACT.BUILD) {
                    build = data
                    build.build()
                }
            })
            return
        }
        this.nearEntity = this.spider.spider.dimension.getEntities({
            location: this.spider.spider.location,
            maxDistance: 20
        })
        this.dataChip.forEach((data) => {
            data.dataAct(this.nearEntity)
        })
    }
    spawn() {
        const spiders: Entity[] = getSpiders()
        let serialNumber = 1;
        spiders.forEach(spider => {
            if (spider.getDynamicProperty("watts:serial_number") == serialNumber) {
                serialNumber++
            }
        });
        this.spider.spider.setDynamicProperty("watts:serial_number", serialNumber)
        this.loadDataChip()
        this.loadLogChip()
    }
    loadDataChip() {
        for (let index = 0; index < this.spider.container.size; index++) {
            let itemStack = this.spider.container.getItem(index);
            if (itemStack?.typeId != "watts:data_chip") {
                continue
            }
            this.dataChip.push(new DataChip(this.spider, this.spider.container.getItem(index)!))
        }
    }
    loadLogChip() {
        for (let index = 0; index < this.spider.container.size; index++) {
            let itemStack = this.spider.container.getItem(index);
            if (itemStack?.typeId != "watts:log_chip") {
                continue
            }
            this.logChip.push(new LogChip(this.spider, this.spider.container, index, this.spider.container.getItem(index)!))
        }
    }
}
