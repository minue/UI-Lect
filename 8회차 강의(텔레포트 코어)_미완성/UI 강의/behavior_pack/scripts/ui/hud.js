import { EntityComponentTypes, world } from "@minecraft/server";
import { ItemFunction, UI_ITEMS } from "../item/itemFunction";
export class UIManage {
    constructor(player) {
        this.strArr = [];
        this.player = player;
        const item = ItemFunction.getHoldItem(player);
        if (item.typeId in UI_ITEMS) {
            this.energy = parseInt(item.getLore()[0]);
            this.maxEnergy = parseInt(item.getLore()[1]);
            this.v = { x: parseInt(item.getLore()[2]), y: parseInt(item.getLore()[3]), z: parseInt(item.getLore()[4]) };
        }
    }
    uiMain() {
        this.player.onScreenDisplay.setActionBar(this.strArr.join());
    }
    energyUI() {
        return [this.makeStr(this.energy), this.makeStr(this.maxEnergy)];
    }
    cooltimeUI() {
        const objective = world.scoreboard.getObjective("cooltime");
        const playerIdentity = this.player.scoreboardIdentity;
        const cool = objective?.getScore(playerIdentity);
        return [this.makeStr(cool)];
    }
    locUI() {
        return [this.makeStr(this.v.x),
            this.makeStr(this.v.y),
            this.makeStr(this.v.z)];
    }
    spiderUI(spiders) {
        return [];
    }
    mergeUI(str) {
        return [];
    }
    makeStr(num) {
        let str = `000000000${num}`;
        str = str.substring(str.length - 9);
        return `|${str}`;
    }
}
class SpiderUI {
    id() {
        let str = `|0000000000000000000${this.spider.id}`;
        str = str.substring(str.length - 19);
        return [str];
    }
    hpUI() {
        const hp = this.spider.getComponent(EntityComponentTypes.Health);
        const current = hp.currentValue, max = hp.defaultValue;
        return [this.makeStr(current), this.makeStr(max)];
    }
    energyUI() {
        const energyObj = world.scoreboard.getObjective("energy");
        const maxEnergyObj = world.scoreboard.getObjective("maxEnergy");
        const playerIdentity = this.spider.scoreboardIdentity;
        const energy = energyObj?.getScore(playerIdentity);
        const maxEnergy = maxEnergyObj?.getScore(playerIdentity);
        return [this.makeStr(energy), this.makeStr(maxEnergy)];
    }
    locUI() {
        return [this.makeStr(this.spider.location.x),
            this.makeStr(this.spider.location.y),
            this.makeStr(this.spider.location.z)];
    }
    makeStr(num) {
        let str = `000000000${num}`;
        str = str.substring(str.length - 9);
        return `|${str}`;
    }
    makeName() {
        let str = `         ${this.spider.nameTag}`;
        str = str.substring(str.length - 9);
        return `|${str}`;
    }
    makeUI() {
        const uiElement = [];
        return uiElement.concat(this.hpUI(), this.energyUI(), this.locUI(), this.makeName(), this.id());
    }
    constructor(spider) {
        this.spider = spider;
    }
    static getString(spider) {
        return new SpiderUI(spider).makeUI();
    }
}
SpiderUI.registerSpider = [];
