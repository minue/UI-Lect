import { ReinforceItem } from "./ItemList";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { checkItem } from "./checkInven";
function makeChooseForm(itemList) {
    const form = new ActionFormData();
    form.title("Select!");
    for (let i = 0; i < itemList.length; i++) {
        form.button(`%${itemList[i].resultItemName.replace("watts:", "")}\n%${itemList[i].text}`, itemList[i].resultTexture);
    }
    return form;
}
function itemGridForm(player, itemList) {
    const form = new MessageFormData();
    form.title("Items Needed");
    let text = ('%item.need\n\n');
    let canCraft = true;
    let itemName, namespace, key;
    if (itemList.need.length == 0) {
        text += `-%Nope\n`;
    }
    for (let i = 0; i < itemList.need.length; i++) {
        namespace = JSON.stringify(itemList.need[i]).replace("{", "").replaceAll("\"", "").split(":")[0];
        itemName = JSON.stringify(itemList.need[i]).replace("{", "").replaceAll("\"", "").split(":")[1];
        key = namespace + ":" + itemName;
        text += `-%${itemName}\n`;
        canCraft = canCraft ? checkItem(player, key, itemList.need[i][key]) : false;
    }
    text += "\n\n";
    if (!canCraft) {
        text += `%NEI\n\n\n`;
    }
    text += `%addition\n\n`;
    for (let i = 0; i < itemList.add.length; i++) {
        namespace = JSON.stringify(itemList.add[i]).replace("{", "").replaceAll("\"", "").split(":")[0];
        itemName = JSON.stringify(itemList.add[i]).replace("{", "").replaceAll("\"", "").split(":")[1];
        key = namespace + ":" + itemName;
        text += `-%${itemName}\n`;
    }
    form.body(text);
    form.button1("제작");
    form.button2("취소");
    form.show(player);
}
export function reinforceFunc(player, holdItem) {
    if (Object.keys(ReinforceItem).includes(holdItem)) {
        makeChooseForm(ReinforceItem[holdItem]).show(player).then((res) => {
            if (res.selection == null) {
                return;
            }
            itemGridForm(player, ReinforceItem[holdItem][res.selection]);
        });
    }
}
