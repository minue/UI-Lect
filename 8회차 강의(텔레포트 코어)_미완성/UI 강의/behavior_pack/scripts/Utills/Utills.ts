import { Vector3 } from "@minecraft/server";

export class Utills {
    static distance(vec1: Vector3, vec2: Vector3): number {
        const distance = Math.sqrt((vec1.x - vec2.x) ^ 2 +
            (vec1.y - vec2.y) ^ 2 +
            (vec1.z - vec2.z) ^ 2)
        return distance;
    }
}