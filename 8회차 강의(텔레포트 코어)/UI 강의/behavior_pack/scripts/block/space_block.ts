import {  BlockCustomComponent } from "@minecraft/server";

export const SpaceOre : BlockCustomComponent = {
    onStepOn(event) {
        event.entity?.runCommand("spreadplayers ~ ~ 1 16 @s")
    },
};
