import { world } from "@minecraft/server";
class Log {
    constructor(id, x, y, z, dimension) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.id = id;
        this.dimension = world.getDimension(dimension);
    }
    checkNearest() {
        this.dimension.getBlockAbove(this, { includePassableBlocks: true });
    }
    teleport(player) {
        player.teleport(this, { dimension: this.dimension });
    }
}
export class LogChip {
    constructor(spider, container, index, item) {
        this.spider = spider;
        this.container = container;
        this.index = index;
        this.chip = item;
        this.log = item.getLore();
    }
    addLog(str) {
        if (this.log.length >= 50) {
            return this.chip;
        }
        this.log.push(str);
        this.chip.setLore(this.log);
        this.container.setItem(this.index, this.chip);
        return this.chip;
    }
    setLog(str) {
        this.chip.setLore(str);
        this.container.setItem(this.index, this.chip);
        return this.chip;
    }
    getLog() {
        const log = this.chip.getLore();
        this.log = log;
        return log;
    }
    canWrite() {
        if (this.log.length >= 50) {
            return false;
        }
        return true;
    }
    static makeBlockLog(block) {
        const str = `block.log/x: ${block.x}/y: ${block.y}/z: ${block.z}/type: ${block.typeId}/dimension: ${block.dimension.id}`;
        return str;
    }
    blockLog(block) {
        return this.addLog(LogChip.makeBlockLog(block));
    }
    logInterpret(str) {
        const log = str.split("/");
        const x = parseFloat(log[0].replace("x: ", ""));
        const y = parseFloat(log[1].replace("y: ", ""));
        const z = parseFloat(log[2].replace("z: ", ""));
        const typeid = log[3].replace("type: ", "");
        const dimension = log[4].replace("dimension: ", "");
        return new Log(typeid, x, y, z, dimension);
    }
}
