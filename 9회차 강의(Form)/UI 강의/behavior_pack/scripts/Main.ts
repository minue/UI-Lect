import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((event) => {
    if(event.itemStack.typeId == "minecraft:stick"){
        new ActionFormData().title("Hello World").button("Hello World").show(event.source);
    }
})