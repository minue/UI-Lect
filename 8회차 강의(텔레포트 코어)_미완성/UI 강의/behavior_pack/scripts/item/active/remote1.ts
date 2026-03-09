import { ItemUseAfterEvent } from "@minecraft/server";
import { Utills } from "../../Utills/Utills";
import { ItemFunction } from "../itemFunction";

export function remote1(ev: ItemUseAfterEvent) {
    const { source, itemStack } = ev
    if (itemStack.typeId != "watts:remote1") {
        return
    }
    if (itemStack.getLore().length == 0) {
        const { x, y, z } = source.location
        itemStack.setLore(["100", "100", `x ${Math.round(x)}`, `y ${Math.round(y)}`, `z ${Math.round(z)}`]);
        ItemFunction.setHoldItem(source, itemStack)
        return
    }
    sneakRemote1(ev)
    useRemote1(ev)
}

function sneakRemote1(ev: ItemUseAfterEvent) {
    const { source, itemStack } = ev
    if (!source.isSneaking) {
        return
    }
    const { x, y, z } = source.location
    const lore = itemStack.getLore()
    itemStack.setLore([lore[0], lore[1], `x ${x}`, `y ${y}`, `z ${z}`])
    ItemFunction.setHoldItem(source, itemStack)
}

function useRemote1(ev: ItemUseAfterEvent) {
    const { source, itemStack } = ev
    if (source.isSneaking) {
        return
    }
    const lore = itemStack.getLore()
    const x = parseInt(lore[2].replace("x ", "")), y = parseInt(lore[3].replace("y ", "")), z = parseInt(lore[4].replace("z ", ""));
    const distance = Utills.distance(source.location, { x: x, y: y, z: z })
    const consume = Math.min(30, Math.round(3 + distance / 30))
    const energy = parseInt(itemStack.getLore()[1])
    if (energy < consume) {
        source.sendMessage("LOW ENERGY!!")
        return;
    }
    itemStack.setLore([lore[0], `${energy - consume}`, `x ${x}`, `y ${y}`, `z ${z}`])
    ItemFunction.setHoldItem(source, itemStack)
    source.teleport({ x, y, z })
}