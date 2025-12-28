import { EntityComponentTypes, world } from "@minecraft/server";
class UIManage {
    constructor() {
        this.strArr = [];
    }
    static uiMain(player) {
    }
    energyUI(dw) {
        return [this.makeStr(dw.getEnergy()), this.makeStr(dw.getMaxEnergy())];
    }
    cooltimeUI(player) {
        const objective = world.scoreboard.getObjective("cooltime");
        const playerIdentity = player.scoreboardIdentity;
        const cool = objective?.getScore(playerIdentity);
        return [this.makeStr(cool)];
    }
    locUI(dw) {
        return [this.makeStr(dw.getCoordinate()[0]),
            this.makeStr(dw.getCoordinate()[1]),
            this.makeStr(dw.getCoordinate()[2])];
    }
    spiderUI(spiderUI) {
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
        return uiElement.concat(this.hpUI(), this.energyUI(), this.locUI(), this.makeName());
    }
    constructor(spider) {
        this.spider = spider;
    }
    static getString() {
    }
}
SpiderUI.registerSpider = [];
