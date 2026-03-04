import { system, world } from "@minecraft/server"
import { registerScore } from "./data/scoreboard"
import { spaceOre } from "./block/space_block"
import { ItemEvents } from "./item/itemFunction"

world.afterEvents.worldLoad.subscribe((ev) => {
    registerScore()
})

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent(
        "watts:teleport_block",
        spaceOre
    )
})

world.afterEvents.itemUse.subscribe((ev) => {
    ItemEvents.forEach(itemEvent => {
        itemEvent(ev)
    });
})