import { EquipmentSlot } from "@minecraft/server";
import { remote1 } from "./active/remote1";
export const UI_ITEMS = [
    "watts:remote1",
    "watts:remote2",
    "watts:remote3",
    "watts:dimension_knife",
    "watts:dimension_sword"
];
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
