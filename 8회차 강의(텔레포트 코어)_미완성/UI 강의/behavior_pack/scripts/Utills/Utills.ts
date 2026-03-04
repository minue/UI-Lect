import { Vector3 } from "@minecraft/server";

export class Utills {
    static distance(vec1: Vector3, vec2: Vector3): number {
        const distance = Math.sqrt(((vec1.x - vec2.x) * (vec1.x - vec2.x)) +
            ((vec1.y - vec2.y) * (vec1.y - vec2.y)) +
            ((vec1.z - vec2.z) * (vec1.z - vec2.z)))
        return distance;
    }
}