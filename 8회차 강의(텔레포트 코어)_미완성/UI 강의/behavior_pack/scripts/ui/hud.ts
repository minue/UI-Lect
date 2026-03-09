import { Entity, EntityComponentTypes, EntityHealthComponent, Player, Vector3, world } from "@minecraft/server";
import { DimensionWeapon } from "../item/weapon/dimensionWeapon";
import { ItemFunction, UI_ITEMS } from "../item/itemFunction";

export class UIManage {
    strArr: string[] = []
    player: any;
    energy: number
    maxEnergy: number
    cooltime: number
    v: Vector3
    constructor(player: Player) {
        this.player = player
        const item = ItemFunction.getHoldItem(player)
        if (item.typeId in UI_ITEMS) {
            this.energy = parseInt(item.getLore()[0])
            this.maxEnergy = parseInt(item.getLore()[1])
            this.v = { x: parseInt(item.getLore()[2]), y: parseInt(item.getLore()[3]), z: parseInt(item.getLore()[4]) }
        }
    }
    public uiMain() {
        this.player.onScreenDisplay.setActionBar(this.strArr.join())
    }
    private energyUI(): string[] {
        return [this.makeStr(this.energy), this.makeStr(this.maxEnergy)]
    }
    private cooltimeUI(): string[] {
        const objective = world.scoreboard.getObjective("cooltime")
        const playerIdentity = this.player.scoreboardIdentity
        const cool = objective?.getScore(playerIdentity!)!
        return [this.makeStr(cool)]
    }
    private locUI(): string[] {
        return [this.makeStr(this.v.x),
        this.makeStr(this.v.y),
        this.makeStr(this.v.z)]
    }
    private spiderUI(spiders: Entity[]): string[] {
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
    private id(): string[] {
        let str = `|0000000000000000000${this.spider.id}`
        str = str.substring(str.length - 19)
        return [str]
    }
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
        return uiElement.concat(this.hpUI(), this.energyUI(), this.locUI(), this.makeName(), this.id())
    }
    constructor(spider: Entity) {
        this.spider = spider
    }
    public static getString(spider) {
        return new SpiderUI(spider).makeUI()
    }
}