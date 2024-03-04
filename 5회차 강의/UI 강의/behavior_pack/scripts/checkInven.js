export function checkItem(player, item, num) {
    let count = 0;
    const inven = player.getComponent("minecraft:inventory");
    if (inven.container == undefined) {
        return false;
    }
    for (let i = 0; i < inven.inventorySize; i++) {
        if (inven.container.getItem(i) == undefined) {
            continue;
        }
        if (inven.container.getItem(i).typeId == item) {
            count += inven.container.getItem(i).amount;
        }
        if (count >= num) {
            return true;
        }
    }
    return false;
}
