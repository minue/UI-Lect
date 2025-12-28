import { ActionFormData } from "@minecraft/server-ui";
import { DimensionWeapon } from "../item/dimensionWeapon";

export const skillSelectFormData = new ActionFormData()
    .button("watts.ui.select.skill.cancel")
    .button("watts.ui.select.skill.teleport_slash")
    .button("watts.ui.select.skill.rift_slash")
    .button("watts.ui.select.skill.position_swap")
    .button("watts.ui.select.skill.phase_pierce")
    .button("watts.ui.select.skill.jump_slash")
    .button("watts.ui.select.skill.space_time_lock")
    .button("watts.ui.select.skill.return_portal")
    .button("watts.ui.select.skill.blink_combo")
    .button("watts.ui.select.skill.portal_slash")

export function skillSelct(itemClass: DimensionWeapon) {
    skillSelectFormData.show(itemClass.getPlayer()).then((response) => {
        if (response.canceled || response.selection == 0) {
            return
        } else {
            itemClass.setSkill(response.selection!)
        }
    })
}