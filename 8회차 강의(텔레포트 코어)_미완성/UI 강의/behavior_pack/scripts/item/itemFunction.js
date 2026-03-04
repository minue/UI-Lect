import { EquipmentSlot } from "@minecraft/server";
import { remote1 } from "./active/remote1";
export class ItemFunction {
    static getHoldItem(player) {
        const equipComp = player.getComponent("minecraft:equippable");
        const itemStack = equipComp.getEquipment(EquipmentSlot.Mainhand);
        return itemStack;
    }
    static setHoldItem(player, itemStack) {
        const equipComp = player.getComponent("minecraft:equippable");
        equipComp.setEquipment(EquipmentSlot.Mainhand, itemStack);
    }
}
export const ItemEvents = [
    remote1
];
