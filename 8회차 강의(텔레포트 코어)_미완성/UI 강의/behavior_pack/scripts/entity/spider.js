import { EntityComponentTypes, world } from "@minecraft/server";
import { DataChip } from "../item/chip/data_chip";
import { LogChip } from "../item/chip/log_chip";
import { getMiner, Miner } from "./miner";
export function getSpiders() {
    const overworld = world.getDimension("overworld");
    const nether = world.getDimension("nether");
    const the_end = world.getDimension("the_end");
    const overworldSpider = overworld.getEntities({
        type: "watts:electric_spider_alt",
    });
    const overworldSpiderBig = overworld.getEntities({
        type: "watts:electric_spider_alt_big",
    });
    const netherSpider = nether.getEntities({
        type: "watts:electric_spider_alt",
    });
    const netherSpiderBig = nether.getEntities({
        type: "watts:electric_spider_alt_big",
    });
    const the_endSpider = the_end.getEntities({
        type: "watts:electric_spider_alt",
    });
    const the_endSpiderBig = the_end.getEntities({
        type: "watts:electric_spider_alt_big",
    });
    return overworldSpider.concat(overworldSpiderBig)
        .concat(netherSpider).concat(netherSpiderBig)
        .concat(the_endSpider).concat(the_endSpiderBig);
}
function getSlave(player) {
    const spiders = getSpiders();
    const result = [];
    spiders.forEach(spider => {
        const tame = spider.getComponent(EntityComponentTypes.Tameable);
        if (tame.tamedToPlayerId == player.id) {
            result.push(spider);
        }
    });
    return result;
}
function getSlaveMiner(spider) {
    const miners = getMiner();
    const result = [];
    miners.forEach((miner) => {
        if (spider.spider.getDynamicProperty("watts:serial_number") == miner.getDynamicProperty("watts:parent_serial_number")) {
            result.push(new Miner(miner, spider));
        }
    });
    return result;
}
export function spiderInteract(ev) {
    if (!ev.itemStack) {
        return;
    }
    if (ev.itemStack.typeId.startsWith("watts:remote")) {
    }
}
export function getSlaveSorted(player) {
    const slaveNum = world.scoreboard.getObjective("slaveNum");
    const slave = getSlave(player);
    const result = [];
    slave.forEach((spider) => {
        const num = slaveNum.getScore(spider.scoreboardIdentity);
        if (num > 0) {
            result.push(spider);
        }
    });
    result.sort((a, b) => {
        const aNum = slaveNum.getScore(a.scoreboardIdentity);
        const bNum = slaveNum.getScore(b.scoreboardIdentity);
        return aNum - bNum;
    });
}
export class Spider {
    constructor(spider) {
        this.miners = [];
        this.spider = spider;
        this.miners = getSlaveMiner(this);
        this.react = new React(this);
        this.container = this.spider.getComponent(EntityComponentTypes.Inventory).container;
    }
    spawnMiner() {
        this.miners.push(Miner.spawn(this, this.react.targetBlock[0]));
    }
    despawnMiner(miner) {
        miner.miner.remove();
    }
    haveItemCount(item) {
        let count = 0;
        for (let i = 0; i < this.container.size; i++) {
            if (this.container.getItem(i)?.typeId == item) {
                count += this.container.getItem(i).amount;
            }
        }
        return count;
    }
    removeItem(item, count = 1) {
        if (this.haveItemCount(item) < count) {
            return false;
        }
        this.spider.runCommand(`/clear @s ${item} -1 ${count}`);
        return true;
    }
    getPower() {
        const objective = world.scoreboard.getObjective("energy");
        return objective.getScore(this.spider);
    }
    getMaxPower() {
        const objective = world.scoreboard.getObjective("maxEnergy");
        return objective.getScore(this.spider);
    }
    setPower(num) {
        const objective = world.scoreboard.getObjective("energy");
        objective.setScore(this.spider, (num > this.getMaxPower()) ? this.getMaxPower() : num);
    }
    setMaxPower(num) {
        const objective = world.scoreboard.getObjective("maxEnergy");
        objective.setScore(this.spider, num);
    }
}
class React {
    constructor(spider) {
        this.dataChip = [];
        this.logChip = [];
        this.spider = spider;
        this.loadDataChip();
        this.loadLogChip();
    }
    act() {
        this.nearEntity = this.spider.spider.dimension.getEntities({
            location: this.spider.spider.location,
            maxDistance: 20
        });
        this.dataChip.forEach((data) => {
            data.dataAct(this.nearEntity);
        });
    }
    spawn() {
        const spiders = getSpiders();
        let serialNumber = 1;
        spiders.forEach(spider => {
            if (spider.getDynamicProperty("watts:serial_number") == serialNumber) {
                serialNumber++;
            }
        });
        this.spider.spider.setDynamicProperty("watts:serial_number", serialNumber);
        this.loadDataChip();
        this.loadLogChip();
    }
    loadDataChip() {
        for (let index = 0; index < this.spider.container.size; index++) {
            let itemStack = this.spider.container.getItem(index);
            if (itemStack?.typeId != "watts:data_chip") {
                continue;
            }
            this.dataChip.push(new DataChip(this.spider, this.spider.container.getItem(index)));
        }
    }
    loadLogChip() {
        for (let index = 0; index < this.spider.container.size; index++) {
            let itemStack = this.spider.container.getItem(index);
            if (itemStack?.typeId != "watts:log_chip") {
                continue;
            }
            this.logChip.push(new LogChip(this.spider, this.spider.container, index, this.spider.container.getItem(index)));
        }
    }
}
