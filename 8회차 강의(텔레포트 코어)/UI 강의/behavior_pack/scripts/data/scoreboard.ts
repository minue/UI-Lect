import { system, world } from "@minecraft/server"

export const scoreList = [
    "energy",
    "skillType",
    "channelType"
]

export function registerScore() {
    scoreList.forEach(scoreName => {
        let objective = world.scoreboard.getObjective(scoreName);
        if(!objective){
            world.scoreboard.addObjective(scoreName);
        }
    });
}