import { Entity, EntityComponentTypes, EntityDamageCause, EntityHealthComponent, EntityHurtAfterEvent, EntityTypes, PlayerInteractWithEntityAfterEvent, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

const spiderUI = new ActionFormData()
    .button("watts.ui.select.spider.cancel")
    .button("watts.ui.select.spider.set_num")
    .button("watts.ui.select.spider.set_mode")
    .button("watts.ui.select.spider.get_log")

const setNum = new ModalFormData()
    .slider("watts.ui.select.spider.select_num", 1, 8)
    .submitButton("watts.ui.select.confirm")

const setMode = new ActionFormData()
    .button("watts.ui.set_target_entity.spider.basic_set")
    .button("watts.ui.set_target_block.spider.set")
    .button("watts.ui.set_target_entity.spider.advanced_set")
const get_log = new ModalFormData()
    .submitButton("watts.ui.log.spider.confirm")

class React {
    static readonly IGNORE = 0
    static readonly ATTACK = 1
    static readonly KIDNAP = 2

    id: string
    act: number
    x: number
    y: number
    z: number
    hp: number
    strArr: string[]
    spider: Entity

    constructor(str: string) {
        this.strArr = str.split(".")
        this.id = this.strArr[0]
        this.act = parseInt(this.strArr[1])
        if (this.act == React.KIDNAP) {
            this.x = parseInt(this.strArr[2])
            this.y = parseInt(this.strArr[3])
            this.z = parseInt(this.strArr[4])
            this.hp = parseInt(this.strArr[5])
        }
    }

    spiderAct(ent: Entity) {
        if (this.act == React.IGNORE) {
            return
        }
        const health = (ent.getComponent(EntityComponentTypes.Health) as EntityHealthComponent).currentValue
        if (this.act == React.KIDNAP && this.hp == -1) {
            this.spiderKidnap(ent)
            return;
        }
        if ((this.act == React.KIDNAP && this.hp >= health) || (this.act == React.ATTACK)) {
            this.spiderAttack(ent)
            return;
        }
    }
    spiderAttack(ent: Entity) {
        if(this.spider.getProperty("watts:has_target")){
            return;
        }
        this.spider.applyDamage(0, { cause: EntityDamageCause.entityAttack, damagingEntity: ent })
        this.spider.triggerEvent("watts:has_target")
    }
    spiderKidnap(ent: Entity) {
        const hp = (ent.getComponent(EntityComponentTypes.Health) as EntityHealthComponent).currentValue
        const vx = ent.location.x, vy = ent.location.y, vz = ent.location.z
        const distance = Math.sqrt((vx - this.x) ^ 2 + (vy - this.y) ^ 2 + (vz - this.z) ^ 2)
        const consume = Math.min(100, Math.round(5 + 2 * distance) + Math.round(hp / 5))
        const energyObj = world.scoreboard.getObjective("energy")
        const identity = this.spider.scoreboardIdentity
        const energy = energyObj?.getScore(identity!)!

        if (consume > energy) {
            return
        }

        energyObj?.setScore(identity!, energy - consume)
        this.spider.triggerEvent("watts:kidnap_mode")
    }

    attackEvent(ev: EntityHurtAfterEvent) {
        this.spiderAct(ev.hurtEntity)
    }
}

function basicEntity(ev: PlayerInteractWithEntityAfterEvent) {
    const setModeBasicEntity = new ActionFormData()
    const entityTypes = EntityTypes.getAll()

    entityTypes.forEach((ent) => {
        setModeBasicEntity.button(`${ent.id}`)
    })
}

function basicEntityReact(ev: PlayerInteractWithEntityAfterEvent) {
    const tags: string[] = ev.target.getTags()
    let react: string[]
    tags.forEach((tag) => {
        if (tag.startsWith("watts.spider.react=")) {
            react = tag.replace("watts.spider.react=", "").split("/")
            return;
        }
    })
}

export function spiderUIFunc(ev: PlayerInteractWithEntityAfterEvent) {
    spiderUI.show(ev.player).then((response) => {
        if (response.canceled || response.selection == 0) {
            return
        } else {
        }
    })
}

function constructor(str: any, string: any) {
    throw new Error("Function not implemented.");
}
