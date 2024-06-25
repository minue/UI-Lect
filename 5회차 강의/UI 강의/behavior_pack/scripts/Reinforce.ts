import { EntityEquippableComponent, EntityInventoryComponent, EquipmentSlot, ItemComponentTypes, ItemDurabilityComponent, ItemStack, Player } from "@minecraft/server";
import { IReinforceItem, IReinforceTable, ReinforceItem, makeTable } from "./ItemList";
import { ActionFormData, ActionFormResponse, MessageFormData, MessageFormResponse, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
import { checkItem, checkItemNum } from "./checkInven";
import { NEIfunc, checkAddingredient, randReinforce } from "./Util";

function makeChooseForm(itemList: IReinforceItem[]) {
    const form = new ActionFormData();

    form.title("Select!")

    for (let i = 0; i < itemList.length; i++) {
        form.button(`%${itemList[i].resultItemName.replace("watts:", "")}\n%${itemList[i].text}`, itemList[i].resultTexture)
    }

    return form
}

function itemGridForm(player: Player, itemList: IReinforceItem, item: ItemStack) {
    const form = new MessageFormData();

    const table = makeTable();

    form.title("Items Needed")

    let text = ('%item.need\n\n')
    let canCraft = true
    let itemName, namespace, key
    let enough: boolean;

    if (itemList.need.length == 0) {
        text += `-%Nope\n`
    }

    table.change = itemList.change

    for (let i = 0; i < itemList.need.length; i++) {
        itemName = itemList.need[i][0].split(":")[1]
        key = itemList.need[i][0]

        enough = checkItem(player, key, itemList.need[i][1])[0]

        canCraft = canCraft ? enough : false

        if (enough) {
            text += `§9`
        } else {
            text += `§c`
        }

        if (namespace == "minecraft") {
            text += `-%item.${itemName}.name `
        } else {
            text += `-%${itemName} `
        }

        text += `* ${itemList.need[i][1]}\n`

        table.need.push({
            item: key,
            count: itemList.need[i][1],
            need: true,
            effect: null,
            percent: null,
            texture: itemList.need[i][2]
        })
    }

    text += "\n§f"

    if (!canCraft) {
        text += `%NEI\n\n\n`
    }

    text += `%addition\n\n`

    for (let i = 0; i < itemList.add.length; i++) {
        itemName = itemList.add[i][0].split(":")[1]
        key = namespace + ":" + itemName


        if (namespace == "minecraft") {
            text += `-%item.${itemName}.name\n`
        } else {
            text += `-%${itemName}\n`
        }
    }

    for (let i = 0; i < itemList.plus.length; i++) {
        itemName = itemList.plus[i][0].split(":")[1]
        key = namespace + ":" + itemName


        if (namespace == "minecraft") {
            text += `-%item.${itemName}.name\n`
        } else {
            text += `-%${itemName}\n`
        }
    }

    form.body(text)

    form.button1("제작")
    form.button2("취소")

    form.show(player).then((res: MessageFormResponse) => {
        if (res.selection == 0) {
            reinforceWindow(player, item, itemList, table)
        }
    })
}

function reinforceItem(player: Player, item: ItemStack, resultItemName: string, data: IReinforceTable, per: number) {

    const effect: object = {};

    const itemStack = (player.getComponent("minecraft:equippable") as EntityEquippableComponent)
        .getEquipment(EquipmentSlot.Mainhand);

    const resultEffect: string[] = itemStack!.getLore();

    player.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 air`)

    for (let i = 0; i < data.need.length; i++) {
        if (data.need[i].item) {
            player.runCommand(`clear @s ${data.need[i].item} 0 ${data.need[i].count}`)
        }
    }

    for (let i = 0; i < data.add.length; i++) {
        if (data.add[i].item) {
            player.runCommand(`clear @s ${data.add[i].item} 0 ${data.add[i].count}`)
        }
    }

    if (!randReinforce(per)) {
        player.sendMessage({ translate: 'reinforce.fail' })
        return;
    }

    for (let i = 0; i < 6; i++) {
        if (data.add[i].item == null) {
            continue;
        }
        player.runCommand(`clear @s ${data.add[i].item} ${data.add[i].count}`)

        if (data.add[i].effect! != null) {
            if (effect[data.add[i].effect![0]] == undefined) {
                effect[data.add[i].effect![0]] = 0
            }
            effect[data.add[i].effect![0]] += data.add[i].effect![1] * data.add[i].count!
        }
    }

    const inven = player.getComponent("minecraft:inventory") as EntityInventoryComponent

    const resultItem = new ItemStack(resultItemName)
    const durabilityComponent = resultItem.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent
    const resultDurability = durabilityComponent.maxDurability
    const damage = (item.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent).damage
    const durability = (item.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent).maxDurability
    const resultDamage = Math.floor((resultDurability / durability) * damage)

    durabilityComponent.damage = resultDamage

    const effectKey = Object.keys(effect)

    for (let i = 0; i < resultEffect.length; i++) {
        if (Object.keys(data.change).indexOf(resultEffect[i]) > -1) {
            effectKey.push(data.change[resultEffect[i]])
            effect[data.change[resultEffect[i]]] = 100
        }
    }

    for (let i = 0; i < effectKey.length; i++) {
        if (!randReinforce(effect[effectKey[i]])) {
            continue;
        }
        if (resultEffect.indexOf(effectKey[i]) > -1) {
            continue;
        }
        removeDuplicate(effectKey[i], resultEffect)
        resultEffect.push(effectKey[i])
    }


    player.sendMessage({ translate: 'reinforce.success' })
    if (resultEffect.length == 0) {
        inven.container?.addItem(resultItem)
        return;
    }
    resultItem.setLore(resultEffect)

    inven.container?.addItem(resultItem)
}

function removeDuplicate(effectKey: string, resultEffect: string[]) {
    const keyword1 = effectKey.split(".")[0]
    let keyword2;
    const removeList = []

    if (keyword1 == "skill") {
        for (let i = 0; i < resultEffect.length; i++) {
            keyword2 = resultEffect[i].split(".")[1]
            if (effectKey.split(".")[1] == keyword2) {
                resultEffect.splice(i, 1)
                return
            }
        }
        return
    }
    for (let i = 0; i < resultEffect.length; i++) {
        keyword2 = resultEffect[i].split(".")[0]
        if (keyword1 == keyword2) {
            resultEffect.splice(i, 1)
            return
        }
    }
}

export function reinforceWindow(player: Player, item: ItemStack, itemList: IReinforceItem, data: IReinforceTable) {
    const form = new ActionFormData();

    let canCraft = true
    let key
    let check;
    let text: string;
    let percent: number = 0;

    form.title("watts.ui.reinforce.1")

    for (let i = 0; i < data.need.length; i++) {
        key = data.need[i].item

        check = checkItem(player, key, data.need[i].count)

        canCraft = canCraft ? check[0] : false

        if (check[0]) {
            text = `§0${check[1]}/${data.need[i].count}`
        } else {
            text = `§c${check[1]}/${data.need[i].count}`
        }

        form.button(text, data.need[i].texture!)
    }

    for (let i = data.need.length; i < 6; i++) {
        form.button("0", "textures/watts/item/blank");
    }

    percent = itemList.success;

    for (let i = 0; i < 6; i++) {
        if (data.add[i].item == null) {
            form.button("0", "textures/watts/item/blank");
            continue;
        }

        if (percent < 100 && data.add[i].percent! > 0) {
            percent += data.add[i].percent! * data.add[i].count!
            percent = percent > 100 ? 100 : percent
        }
        form.button(`${data.add[i].count}`, data.add[i].texture!)
    }

    form.button("", itemList.texture) //강화 대상
    form.button(`${percent}%%`, itemList.resultTexture) //강화 결과

    form.show(player).then((res: ActionFormResponse) => {
        if (res.selection == null) {
            return
        }
        if (res.selection < 6 || res.selection == 12) {
            reinforceWindow(player, item, itemList, data)
        }
        if (5 < res.selection && res.selection < 12) {
            additionalitems(player, itemList, data, res.selection - 6, item)
        }
        if (res.selection == 13) {
            reinforceItem(player, item, itemList.resultItemName, data, percent)
        }
    })
}

function additionalitems(player: Player, itemList: IReinforceItem, data: IReinforceTable, index: number, item: ItemStack) {
    const form = new ActionFormData();
    let itemNum;
    let cancel = false

    form.title("watts.normal.reinforce.add")

    for (let i = 0; i < itemList.add.length; i++) {
        let c = data.add[index].item == itemList.add[i][0] ? data.add[index].count : 0
        itemNum = checkItemNum(player, itemList.add[i][0]) - checkAddingredient(itemList.add[i][0], data) + c
        form.button(`%${itemList.add[i][0].split(":")[1]} [${itemNum}]\n%${itemList.add[i][1][0]} - %${itemList.add[i][1][1]}%%`,
            itemList.add[i][2])
    }
    for (let i = 0; i < itemList.plus.length; i++) {
        let c = data.add[index].item == itemList.plus[i][0] ? data.add[index].count : 0
        itemNum = checkItemNum(player, itemList.plus[i][0]) - checkAddingredient(itemList.plus[i][0], data) + c
        form.button(`%${itemList.plus[i][0].split(":")[1]} [${itemNum}]\n%craft.success.percent - %${itemList.plus[i][1]}%%`,
            itemList.plus[i][2])
    }

    form.show(player).then((res: ActionFormResponse) => {
        if (res.selection == null) {
            reinforceWindow(player, item, itemList, data)
            return
        } else if (res.selection < itemList.add.length) {
            const sel = res.selection
            let c = data.add[sel] == undefined ? 0 : data.add[sel].count
            const numForm = new ModalFormData();
            numForm.slider("COUNT", 0, 20, 1)
            numForm.show(player).then((ans) => {
                if (ans.formValues == null) {
                    reinforceWindow(player, item, itemList, data)
                    return
                }
                if (ans.formValues[0] == 0) {
                    data.add[index] = {
                        item: null,
                        count: 0,
                        need: false,
                        effect: null,
                        percent: 0,
                        texture: null
                    }
                    reinforceWindow(player, item, itemList, data)
                    return
                }
                if (NEIfunc(player, itemList, data, itemList.add[sel][0], ans.formValues[0] as number, item)) {
                    cancel = true
                    return;
                }

                data.add[index] = {
                    item: itemList.add[sel][0],
                    count: ans.formValues![0] as number,
                    need: false,
                    effect: itemList.add[sel][1],
                    percent: 0,
                    texture: itemList.add[sel][2]
                }
                reinforceWindow(player, item, itemList, data)

            })
        } else {
            const sel = res.selection - itemList.add.length
            let c = data.add[sel] == undefined ? 0 : data.add[sel].count
            const numForm = new ModalFormData();
            numForm.slider("COUNT", 0, 20, 1)
            numForm.show(player).then((ans) => {
                if (ans.formValues == null) {
                    reinforceWindow(player, item, itemList, data)
                    return
                }
                if (ans.formValues[0] == 0) {
                    data.add[index] = {
                        item: null,
                        count: 0,
                        need: false,
                        effect: null,
                        percent: 0,
                        texture: null
                    }
                    reinforceWindow(player, item, itemList, data)
                    return
                }
                if (NEIfunc(player, itemList, data, itemList.plus[sel][0], ans.formValues[0] as number, item)) {
                    cancel = true
                    return;
                }
                data.add[index] = {
                    item: itemList.plus[sel][0],
                    count: ans.formValues![0] as number,
                    need: false,
                    effect: null,
                    percent: itemList.plus[sel][1],
                    texture: itemList.plus[sel][2]
                }
                reinforceWindow(player, item, itemList, data)
            })
        }
        if (cancel) {
            return
        }
    })
}

export function reinforceFunc(player: Player, holdItem: ItemStack) {
    if (Object.keys(ReinforceItem).includes(holdItem.typeId)) {
        makeChooseForm(ReinforceItem[holdItem.typeId]).show(player).then((res: ActionFormResponse) => {
            if (res.selection == null) {
                return
            }
            itemGridForm(player, ReinforceItem[holdItem.typeId][res.selection], holdItem)
        })
    }
}