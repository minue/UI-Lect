import { EntityComponentTypes, EntityDamageCause, EntityTypes, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
const spiderUI = new ActionFormData()
    .button("watts.ui.select.spider.cancel")
    .button("watts.ui.select.spider.set_num")
    .button("watts.ui.select.spider.set_mode")
    .button("watts.ui.select.spider.get_log");
const setNum = new ModalFormData()
    .slider("watts.ui.select.spider.select_num", 1, 8)
    .submitButton("watts.ui.select.confirm");
const setMode = new ActionFormData()
    .button("watts.ui.set_target_entity.spider.basic_set")
    .button("watts.ui.set_target_block.spider.set")
    .button("watts.ui.set_target_entity.spider.advanced_set");
const get_log = new ModalFormData()
    .submitButton("watts.ui.log.spider.confirm");
class React {
    constructor(str) {
        this.strArr = str.split(".");
        this.id = this.strArr[0];
        this.act = parseInt(this.strArr[1]);
        if (this.act == React.KIDNAP) {
            this.x = parseInt(this.strArr[2]);
            this.y = parseInt(this.strArr[3]);
            this.z = parseInt(this.strArr[4]);
            this.hp = parseInt(this.strArr[5]);
        }
    }
    spiderAct(ent) {
        if (this.act == React.IGNORE) {
            return;
        }
        const health = ent.getComponent(EntityComponentTypes.Health).currentValue;
        if (this.act == React.KIDNAP && this.hp == -1) {
            this.spiderKidnap(ent);
            return;
        }
        if ((this.act == React.KIDNAP && this.hp >= health) || (this.act == React.ATTACK)) {
            this.spiderAttack(ent);
            return;
        }
    }
    spiderAttack(ent) {
        if (this.spider.getProperty("watts:has_target")) {
            return;
        }
        this.spider.applyDamage(0, { cause: EntityDamageCause.entityAttack, damagingEntity: ent });
        this.spider.triggerEvent("watts:has_target");
    }
    spiderKidnap(ent) {
        const hp = ent.getComponent(EntityComponentTypes.Health).currentValue;
        const vx = ent.location.x, vy = ent.location.y, vz = ent.location.z;
        const distance = Math.sqrt((vx - this.x) ^ 2 + (vy - this.y) ^ 2 + (vz - this.z) ^ 2);
        const consume = Math.min(100, Math.round(5 + 2 * distance) + Math.round(hp / 5));
        const energyObj = world.scoreboard.getObjective("energy");
        const identity = this.spider.scoreboardIdentity;
        const energy = energyObj?.getScore(identity);
        if (consume > energy) {
            return;
        }
        energyObj?.setScore(identity, energy - consume);
        this.spider.triggerEvent("watts:kidnap_mode");
    }
    attackEvent(ev) {
        this.spiderAct(ev.hurtEntity);
    }
}
React.IGNORE = 0;
React.ATTACK = 1;
React.KIDNAP = 2;
function basicEntity(ev) {
    const setModeBasicEntity = new ActionFormData();
    const entityTypes = EntityTypes.getAll();
    entityTypes.forEach((ent) => {
        setModeBasicEntity.button(`${ent.id}`);
    });
}
function basicEntityReact(ev) {
    const tags = ev.target.getTags();
    let react;
    tags.forEach((tag) => {
        if (tag.startsWith("watts.spider.react=")) {
            react = tag.replace("watts.spider.react=", "").split("/");
            return;
        }
    });
}
export function spiderUIFunc(ev) {
    spiderUI.show(ev.player).then((response) => {
        if (response.canceled || response.selection == 0) {
            return;
        }
        else {
        }
    });
}
function constructor(str, string) {
    throw new Error("Function not implemented.");
}
