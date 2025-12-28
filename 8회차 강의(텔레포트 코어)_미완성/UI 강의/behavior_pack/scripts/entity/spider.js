import { EntityComponentTypes, world } from "@minecraft/server";
function getSpiders(player) {
    const dimension = player.dimension;
    const spider = dimension.getEntities({
        type: "watts:electric_spider_alt",
    });
    const spiderBig = dimension.getEntities({
        type: "watts:electric_spider_alt_big",
    });
    return spider.concat(spiderBig);
}
function getSlave(player) {
    const spiders = getSpiders(player);
    const result = [];
    spiders.forEach(spider => {
        const tame = spider.getComponent(EntityComponentTypes.Tameable);
        if (tame.tamedToPlayerId == player.id) {
            result.push(spider);
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
