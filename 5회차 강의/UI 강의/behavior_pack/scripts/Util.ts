import { Player } from "@minecraft/server";
import { IReinforceItem, IReinforceTable } from "./ItemList";
import { checkItemNum } from "./checkInven";
import { MessageFormData } from "@minecraft/server-ui";
import { reinforceWindow } from "./Reinforce";

export function randAttackEffect(per: number): boolean{
    const rand = Math.random() * 100
    return rand < per;
}

export function randReinforce(per: number): boolean{
    const rand = Math.random() * 100
    return rand < per;
}

export function checkAddingredient(item: string, data: IReinforceTable): number{
    let num = 0, reduce = 0;
    for(let i = 0 ; i < data.add.length ; i++) {
        num += data.add[i].item == item ? data.add[i].count : 0
    }
    for(let i = 0 ; i < data.need.length ; i++) {
        reduce += data.need[i].item == item ? data.need[i].count : 0
    }
    return num + reduce
}

export function NEIfunc(player: Player, itemList: IReinforceItem, data: IReinforceTable, item: string, c: number){
    if(checkItemNum(player, item) < checkAddingredient(item, data) + c){
        new MessageFormData()
        .title("NEI")
        .body("nei.explanation")
        .button1("reinforce.confirm")
        .button2("reinforce.cancel")
        .show(player)
        .then((formData) => {
            if(formData.selection == null || formData.selection == 1){
                return
            }
            reinforceWindow(player, itemList, data)
        })
        return true
    }
    return false
}
