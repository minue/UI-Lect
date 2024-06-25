function teleport(player, power) {
    let targetLocation = player.location;
    const vec = player.getRotation();
    for (let i = 0; i < power; i++) {
        targetLocation = {
            x: targetLocation.x + 0.1 * player.getViewDirection().x,
            y: targetLocation.y + 0.1 * player.getViewDirection().y,
            z: targetLocation.z + 0.1 * player.getViewDirection().z
        };
        targetLocation.y += 1.5;
        if (!(player.dimension.getBlock(targetLocation)?.isAir || player.dimension.getBlock(targetLocation)?.isLiquid)) {
            continue;
        }
        targetLocation.y -= 1.5;
        player.teleport(targetLocation);
    }
    while (!(player.dimension.getBlock(targetLocation)?.isAir || player.dimension.getBlock(targetLocation)?.isLiquid)) {
        targetLocation.y += 0.1;
        player.teleport(targetLocation);
    }
}
function dash(player, power) {
    let targetLocation = player.location;
    const x = player.getViewDirection().x;
    const y = player.getViewDirection().y;
    const z = player.getViewDirection().z;
    player.applyKnockback(x, z, power, y * power + 0.1);
}
function gale(player, power) {
    let targetLocation = player.location;
    let x, y, z;
    const rangeEntity = player.dimension.getEntities({
        location: targetLocation,
        maxDistance: power
    });
    for (let i = 0; i < rangeEntity.length; i++) {
        x = rangeEntity[i].location.x - targetLocation.x;
        y = rangeEntity[i].location.y - targetLocation.y;
        z = rangeEntity[i].location.z - targetLocation.z;
        const r = Math.sqrt(x * x + y * y + z * z);
        if (player == rangeEntity[i]) {
            continue;
        }
        rangeEntity[i].applyKnockback(x, z, power, y / r * power + 1);
    }
}
export function skillEffect(player, item, lore) {
    const content = lore.split(".");
    let func = (attacker, power) => { };
    const power = parseInt(content[5]);
    switch (content[2]) {
        case "teleport":
            func = teleport;
            break;
        case "gale":
            func = gale;
            break;
        case "dash":
            func = dash;
            break;
        default:
            break;
    }
    func(player, power);
}
