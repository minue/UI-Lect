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

function basicEntity(ev: PlayerInteractWithEntityAfterEvent) {
    const setModeBasicEntity = new ActionFormData()
    const entityTypes = EntityTypes.getAll()

    entityTypes.forEach((ent) => {
        setModeBasicEntity.button(`${ent.id}`)
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