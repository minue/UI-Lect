import { EntityEquippableComponent, EquipmentSlot, ItemStack, Player } from "@minecraft/server"
import { remote1 } from "./active/remote1"

export class ItemFunction {
    public static getHoldItem(player: Player) {
        const equipComp = player.getComponent("minecraft:equippable") as EntityEquippableComponent
        const itemStack = equipComp.getEquipment(EquipmentSlot.Mainhand)!
        return itemStack
    }

    public static setHoldItem(player: Player, itemStack: ItemStack) {
        const equipComp = player.getComponent("minecraft:equippable") as EntityEquippableComponent
        equipComp.setEquipment(EquipmentSlot.Mainhand, itemStack)
    }
}

export const ItemEvents = [
    remote1
]