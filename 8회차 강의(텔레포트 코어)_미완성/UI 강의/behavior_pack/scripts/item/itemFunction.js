import { EquipmentSlot } from "@minecraft/server";
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
