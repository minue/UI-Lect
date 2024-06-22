import { ActionFormData } from "@minecraft/server-ui";
import { EquipmentSlot, system, world } from "@minecraft/server";
import { reinforceFunc } from "./Reinforce";
import { itemEffect } from "./itemEffect";
import { skillEffect } from "./skill";
let form = new ActionFormData();
world.afterEvents.itemUse.subscribe((ev) => {
    if (ev.source.getComponent("minecraft:equippable")
        .getEquipment(EquipmentSlot.Mainhand) == undefined) {
        return;
    }
    const item = ev.source.getComponent("minecraft:equippable")
        .getEquipment(EquipmentSlot.Mainhand);
    const effect = item?.getLore();
    for (let i = 0; i < effect.length; i++) {
        if (effect[i].startsWith("skill")) {
            skillEffect(ev.source, item, effect[i]);
        }
    }
});
world.afterEvents.entityHitEntity.subscribe((ev) => {
    if (ev.damagingEntity.getComponent("minecraft:equippable")
        .getEquipment(EquipmentSlot.Mainhand) == undefined) {
        return;
    }
    const effect = ev.damagingEntity.getComponent("minecraft:equippable")
        .getEquipment(EquipmentSlot.Mainhand)
        ?.getLore();
    for (let i = 0; i < effect.length; i++) {
        itemEffect(ev.damagingEntity, ev.hitEntity, effect[i]);
    }
});
world.beforeEvents.itemUseOn.subscribe((ev) => {
    if (ev.block.permutation.matches("watts:test")) {
        system.run(() => {
            if (ev.source.getTags().includes("watts.in_ui")) {
                return;
            }
            ev.source.addTag("watts.in_ui");
            reinforceFunc(ev.source, ev.itemStack.typeId);
        });
        system.runTimeout(() => { ev.source.removeTag("watts.in_ui"); }, 10);
    }
});
