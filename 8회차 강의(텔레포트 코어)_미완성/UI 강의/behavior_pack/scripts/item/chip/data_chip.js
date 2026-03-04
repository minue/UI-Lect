import { BlockVolume, EntityDamageCause, world } from "@minecraft/server";
export var ACT;
(function (ACT) {
    ACT[ACT["IGNORE"] = 0] = "IGNORE";
    ACT[ACT["ATTACK"] = 1] = "ATTACK";
    ACT[ACT["KIDNAP"] = 2] = "KIDNAP";
    ACT[ACT["MINE"] = 3] = "MINE";
    ACT[ACT["BLOCK_LOG"] = 4] = "BLOCK_LOG";
    ACT[ACT["COLLECT"] = 5] = "COLLECT";
})(ACT || (ACT = {}));
export class DataChip {
    constructor(spider, item) {
        this.spider = spider;
        this.item = item;
        const lore = item.getLore();
        this.act = ACT[lore[0].replace("act: ", "").toUpperCase()];
        if (this.act == ACT.COLLECT) {
            this.itemList = lore.splice(1);
        }
        this.id = lore[1].replace("id: ", "");
        if (this.act == ACT.KIDNAP) {
            this.dimension = world.getDimension(lore[2].replace("dimension: ", ""));
            this.x = parseFloat(lore[3].replace("x: ", ""));
            this.y = parseFloat(lore[4].replace("y: ", ""));
            this.z = parseFloat(lore[5].replace("z: ", ""));
            this.hp = parseInt(lore[6].replace("hp: ", "") == "None" ? "-1" : lore[7].replace("x: ", ""));
        }
    }
    findBlock() {
        const from = {
            x: this.spider.spider.location.x - 5,
            y: this.spider.spider.location.y - 100,
            z: this.spider.spider.location.z - 5
        };
        const to = {
            x: this.spider.spider.location.x + 5,
            y: this.spider.spider.location.y + 100,
            z: this.spider.spider.location.z + 5
        };
        return this.spider.spider.dimension.containsBlock(new BlockVolume(from, to), { includeTypes: [this.id] });
    }
    dataAct(nearEntity) {
        if (this.act == ACT.ATTACK) {
            nearEntity.forEach(ent => {
                if (ent.typeId == this.id) {
                    this.spider.react.targetEntity = ent;
                }
            });
            this.attack(this.spider.react.targetEntity);
        }
        else if (this.act == ACT.KIDNAP) {
            nearEntity.forEach(ent => {
                if (ent.typeId == this.id) {
                    this.kidnapEnt = ent;
                }
            });
            this.kidnap(this.kidnapEnt);
        }
        else if ((this.act == ACT.MINE || this.act == ACT.BLOCK_LOG) && this.findBlock()) {
            for (let x = -5; x < 5; x++) {
                for (let y = -100; y < 100; y++) {
                    for (let z = -5; z < 5; z++) {
                        const loc = {
                            x: this.spider.spider.location.x + x,
                            y: this.spider.spider.location.y + y,
                            z: this.spider.spider.location.z + z
                        };
                        const block = this.spider.spider.dimension.getBlock(loc);
                        if (this.act == ACT.MINE && block?.typeId == this.id) {
                            this.mine(block);
                        }
                        if (this.act == ACT.BLOCK_LOG && block?.typeId == this.id) {
                            this.log(block);
                        }
                    }
                }
            }
        }
        else if (this.act == ACT.COLLECT) {
            nearEntity.forEach(ent => {
                if (ent.typeId == "minecraft:item") {
                    const itemEnt = ent.getComponent("minecraft:item").itemStack;
                    if (this.itemList.includes(itemEnt.typeId)) {
                        this.collect(ent);
                    }
                }
            });
        }
    }
    attack(ent) {
        if (this.spider.spider.getProperty("watts:has_target")) {
            return;
        }
        this.spider.spider.applyDamage(0, { cause: EntityDamageCause.entityAttack, damagingEntity: ent });
        this.spider.spider.triggerEvent("watts:has_target");
    }
    kidnap(ent) {
        ent.teleport(this, { dimension: this.dimension });
    }
    mine(block) {
        if (this.spider.react.targetBlock.includes(block)) {
            return;
        }
        this.spider.react.targetBlock.push(block);
    }
    log(block) {
        let logChip = this.spider.react.logChip;
        for (let i = 0; i < logChip.length; i++) {
            if (logChip[i].canWrite()) {
                logChip[i].blockLog(block);
            }
        }
    }
    collect(ent) {
        this.spider.react.targeItemEnt.push(ent);
    }
}
