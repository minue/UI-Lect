import { world } from "@minecraft/server";
export const scoreList = [
    "energy",
    "slaveNum",
    "maxEnergy",
    "skillType",
    "channelType",
    "cooltime"
];
export function registerScore() {
    scoreList.forEach(scoreName => {
        let objective = world.scoreboard.getObjective(scoreName);
        if (!objective) {
            world.scoreboard.addObjective(scoreName);
        }
    });
}
