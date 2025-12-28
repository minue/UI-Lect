import { system, world } from "@minecraft/server"
import { registerScore } from "./data/scoreboard"
import { spaceOre } from "./block/space_block"

world.afterEvents.worldLoad.subscribe((ev) => {
    registerScore()
})

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent(
        "watts:teleport_block",
        spaceOre
    )
})