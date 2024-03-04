import { EntityInventoryComponent, Player } from "@minecraft/server";

export function checkItem(player: Player, item: string, num: number) {
    let count = 0
    const inven = player.getComponent("minecraft:inventory") as EntityInventoryComponent

    if(inven.container == undefined){
        return false
    }
    
    for(let i = 0; i < inven.inventorySize; i++){
        if(inven.container.getItem(i) == undefined){
            continue
        }
        if(inven.container.getItem(i)!.typeId == item){
            count += inven.container.getItem(i)!.amount
        }
        if(count >= num){
            return true
        }
    }
    return false
}