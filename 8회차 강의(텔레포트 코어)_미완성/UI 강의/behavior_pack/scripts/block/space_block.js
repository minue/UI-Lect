export const SpaceOre = {
    onStepOn(event) {
        event.entity?.runCommand("spreadplayers ~ ~ 1 16 @s");
    },
};
