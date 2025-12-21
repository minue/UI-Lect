import { EntityEquippableComponent, ItemStack, Player } from "@minecraft/server";
import { ItemFunction } from "./itemFunction";


export class dimensionWeapon {
    private equipComp: EntityEquippableComponent;
    private itemStack: ItemStack;
    private energy: number;
    private maxEnergy: number;
    private coordinate: number[];
    constructor(player: Player) {
        const itemStack = ItemFunction.getHoldItem(player);
        if (!(this.itemStack)!.getLore()) {
            ItemFunction.setHoldItem(player, this.setLore(this.itemStack));
        }
        try {
            this.energy = parseInt(this.itemStack.getLore()[0]);
            this.maxEnergy = parseInt(this.itemStack.getLore()[1]);
        } catch (e) {
            this.itemStack = this.setLore(this.itemStack);
        }
        ItemFunction.setHoldItem(player, this.itemStack);
    }

    private setLore(itemStack: ItemStack): ItemStack {
        switch (itemStack.typeId) {
            case "watts:dimension_knife":
                itemStack.setLore(["100", "100", "x -", "y -", "z -", "skill -"]);
                break;
            case "watts:dimension_sword":
                itemStack.setLore(["220", "220", "x -", "y -", "z -", "skill -"]);
                break;
        }
        this.itemStack = itemStack;
        return itemStack;
    }

    private setCoordinate(player: Player) {

    }

    public static useItem(player: Player) {
        if (player.isSneaking) {

        }
    }
}