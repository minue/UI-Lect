import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { skillSelct } from "./skillSelectForm";
import { DimensionWeapon } from "../item/dimensionWeapon";

export const dimensionWeaponFormData = new ActionFormData()
    .button("watts.ui.select.skill")
    .button("watts.ui.select.location")

export function dimensionWeaponFormFunc(itemClass: DimensionWeapon) {
    dimensionWeaponFormData.show(itemClass.getPlayer()).then((response) => {
        if(response.canceled){
            return
        }else if(response.selection == 0){
            skillSelct(itemClass)
        }else if(response.selection == 1){
            itemClass.setCoordinate()
        }
    })
}