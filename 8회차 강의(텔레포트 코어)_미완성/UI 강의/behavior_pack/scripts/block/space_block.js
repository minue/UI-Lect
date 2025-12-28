export const spaceOre = {
    onStepOn(event) {
        event.entity?.runCommand("spreadplayers ~ ~ 1 16 @s");
    },
};
