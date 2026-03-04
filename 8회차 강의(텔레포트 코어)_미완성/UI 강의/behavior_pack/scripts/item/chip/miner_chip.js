import { world } from "@minecraft/server";
export var Type;
(function (Type) {
    Type[Type["NONE"] = 0] = "NONE";
    Type[Type["ENTITY"] = 1] = "ENTITY";
    Type[Type["BLOCK"] = 2] = "BLOCK";
})(Type || (Type = {}));
export class MinerChip {
    constructor(spider, index) {
        this.item = spider.container.getItem(index);
    }
    setEntTarget(ent) {
        this.item.setLore([`ent ${ent.id}`]);
    }
    setBlockTarget(block) {
        this.item.setLore([`block ${block.x} ${block.y} ${block.z} ${block.dimension.id}`]);
    }
    targetReset() {
        this.item.setLore();
    }
    getTargetType() {
        if (this.item.getLore()[0].startsWith("ent")) {
            return Type.ENTITY;
        }
        if (this.item.getLore()[0].startsWith("block")) {
            return Type.BLOCK;
        }
        return Type.NONE;
    }
    getBlockTarget() {
        const loc = this.item.getLore()[0].replace("block ", "").split(" ");
        const x = parseFloat(loc[0]);
        const y = parseFloat(loc[1]);
        const z = parseFloat(loc[2]);
        const dimension = world.getDimension(loc[3]);
        if (dimension.getBlock({ x: x, y: y, z: z }) == undefined) {
            this.targetReset();
        }
        return dimension.getBlock({ x: x, y: y, z: z });
    }
    getEntityTarget() {
        if (world.getEntity(this.item.getLore()[0].replace("ent ", "")) == undefined) {
            this.targetReset();
        }
        return world.getEntity(this.item.getLore()[0].replace("ent ", ""));
    }
}
