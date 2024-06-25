import { EntityComponentTypes, EntityDamageCause } from "@minecraft/server";
import { randAttackEffect } from "./Util";
function knockback(attacker, ent, power) {
    const x = ent.location.x - attacker.location.x;
    const y = ent.location.y - attacker.location.y;
    const z = ent.location.z - attacker.location.z;
    const r = Math.sqrt(x * x + y * y + z * z);
    ent.applyKnockback(x, z, power * 3, y / r * power * 3);
}
function critical(attacker, ent, power) {
    ent.applyDamage(power, { cause: EntityDamageCause.entityAttack, damagingEntity: attacker });
}
function drain(attacker, ent, power) {
    ent.applyDamage(1, { cause: EntityDamageCause.entityAttack, damagingEntity: attacker });
    const health = attacker.getComponent(EntityComponentTypes.Health);
    health.setCurrentValue(health.currentValue + 1);
}
function slow(attacker, ent, power) {
    switch (power) {
        case 1:
            ent.addEffect("slowness", 200, { amplifier: 0, showParticles: true });
            break;
        default:
            break;
    }
}
export function itemEffect(attacker, ent, lore) {
    const content = lore.split(".");
    let func = (attacker, ent, power) => { };
    const percent = parseInt(content[2]);
    switch (content[0]) {
        case "knockback_wind":
            func = knockback;
            break;
        case "critical":
            func = critical;
            break;
        case "drain":
            func = drain;
            break;
        case "slow":
            func = slow;
            break;
        default:
            break;
    }
    if (!randAttackEffect(percent)) {
        return;
    }
    if (attacker.typeId == "minecraft:player") {
        attacker.sendMessage({ translate: `${content[0]}` });
    }
    func(attacker, ent, parseInt(content[1]));
}
