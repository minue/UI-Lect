import { ActionFormData } from "@minecraft/server-ui";
import { system, world } from "@minecraft/server";
import { texture } from "./textureList";
import { reinforceFunc } from "./Reinforce";
let form = new ActionFormData();
form.title("watts.ui.reinforce.1")
    //투입 재료 1~6
    .button("1", "textures/watts/item/tooth")
    .button("2", "textures/watts/item/jewel")
    .button("1", "textures/items/netherite_ingot")
    .button("1", "textures/items/chorus_fruit")
    .button("0", "textures/watts/item/blank")
    .button("0", "textures/watts/item/blank")
    //추가 재료 1~6
    .button("0", "textures/watts/item/blank")
    .button("0", "textures/watts/item/blank")
    .button("0", "textures/watts/item/blank")
    .button("0", "textures/watts/item/blank")
    .button("0", "textures/watts/item/blank")
    .button("0", "textures/watts/item/blank")
    .button("", texture.sword.textures[2]) //강화 대상
    .button("85%%", "textures/watts/item/result_sword"); //강화 결과
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
