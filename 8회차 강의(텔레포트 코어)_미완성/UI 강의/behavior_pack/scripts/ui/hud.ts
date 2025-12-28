import { Entity, EntityComponentTypes, EntityHealthComponent, Player, world } from "@minecraft/server";
import { DimensionWeapon } from "../item/dimensionWeapon";

class UIManage {
    strArr: string[] = []
    constructor() {

    }
    public static uiMain(player: Player) {

    }
    private energyUI(dw: DimensionWeapon): string[] {
        return [this.makeStr(dw.getEnergy()), this.makeStr(dw.getMaxEnergy())]
    }
    private cooltimeUI(player: Player): string[] {
        const objective = world.scoreboard.getObjective("cooltime")
        const playerIdentity = player.scoreboardIdentity
        const cool = objective?.getScore(playerIdentity!)!
        return [this.makeStr(cool)]
    }
    private locUI(dw: DimensionWeapon): string[] {
        return [this.makeStr(dw.getCoordinate()[0]),
        this.makeStr(dw.getCoordinate()[1]),
        this.makeStr(dw.getCoordinate()[2])]
    }
    private spiderUI(spiderUI: SpiderUI): string[] {
        return []
    }
    private mergeUI(str: string[]): string[] {
        return []
    }
    private makeStr(num: number): string {
        let str = `000000000${num}`
        str = str.substring(str.length - 9)
        return `|${str}`
    }
}

class SpiderUI {
    static registerSpider: Entity[] = []
    private spider: Entity
    private hpUI(): string[] {
        const hp = (this.spider.getComponent(EntityComponentTypes.Health) as EntityHealthComponent)
        const current = hp.currentValue, max = hp.defaultValue
        return [this.makeStr(current), this.makeStr(max)]
    }
    private energyUI(): string[] {
        const energyObj = world.scoreboard.getObjective("energy")
        const maxEnergyObj = world.scoreboard.getObjective("maxEnergy")
        const playerIdentity = this.spider.scoreboardIdentity
        const energy = energyObj?.getScore(playerIdentity!)!
        const maxEnergy = maxEnergyObj?.getScore(playerIdentity!)!
        return [this.makeStr(energy), this.makeStr(maxEnergy)]
    }
    private locUI(): string[] {
        return [this.makeStr(this.spider.location.x),
        this.makeStr(this.spider.location.y),
        this.makeStr(this.spider.location.z)]
    }
    private makeStr(num: number): string {
        let str = `000000000${num}`
        str = str.substring(str.length - 9)
        return `|${str}`
    }
    private makeName(): string {
        let str = `         ${this.spider.nameTag}`
        str = str.substring(str.length - 9)
        return `|${str}`
    }
    public makeUI(): string[] {
        const uiElement: string[] = []
        return uiElement.concat(this.hpUI(), this.energyUI(),this.locUI(),this.makeName())
    }
    constructor(spider: Entity) {
        this.spider = spider
    }
    public static getString(){

    }
}