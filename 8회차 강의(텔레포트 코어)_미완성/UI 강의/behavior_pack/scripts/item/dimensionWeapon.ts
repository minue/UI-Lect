import { Entity, EntityComponentTypes, EntityEquippableComponent, EntityHealthComponent, ItemStack, Player, world } from "@minecraft/server"
import { ItemFunction } from "./itemFunction"
import { dimensionWeaponFormFunc } from "../form/dimensionWeaponForm"


export class DimensionWeapon {
    private equipComp: EntityEquippableComponent
    private itemStack: ItemStack
    private energy: number
    private maxEnergy: number
    private coordinate: number[]
    private player: Player
    constructor(player: Player) {
        const itemStack = ItemFunction.getHoldItem(player)
        if (!(this.itemStack)!.getLore()) {
            this.setLore()
        }
        try {
            this.energy = parseInt(this.itemStack.getLore()[0])
            this.maxEnergy = parseInt(this.itemStack.getLore()[1])
        } catch (e) {
            this.setLore()
        }
        ItemFunction.setHoldItem(player, this.itemStack)
    }
    public getPlayer(): Player {
        return this.player;
    }
    public getEnergy(): number {
        this.energy = parseInt(this.itemStack.getLore()[0])
        return this.energy
    }
    public getMaxEnergy(): number {
        this.maxEnergy = parseInt(this.itemStack.getLore()[1])
        return this.maxEnergy
    }
    public getSkill(): number {
        const sn = parseInt(this.itemStack.getLore()[5].replace("skill ", "")) - 1;
        return sn
    }
    public getCoordinate() {
        this.coordinate[0] = parseInt(this.itemStack.getLore()[2].replace("x ", ""))
        this.coordinate[1] = parseInt(this.itemStack.getLore()[3].replace("y ", ""))
        this.coordinate[2] = parseInt(this.itemStack.getLore()[4].replace("z ", ""))
        return this.coordinate
    }
    public setEnergy(energy: undefined|number) {
        if(energy != undefined){
            this.energy = energy
        }
        const lore: string[] = this.itemStack.getLore();
        lore[0] = `${this.energy}`
        this.itemStack.setLore(lore)
        ItemFunction.setHoldItem(this.player, this.itemStack)
    }
    public setMaxEnergy(maxEnergy: undefined|number) {
        if(maxEnergy != undefined){
            this.maxEnergy = maxEnergy
        }
        const lore: string[] = this.itemStack.getLore();
        lore[1] = `${this.maxEnergy}`
        this.itemStack.setLore(lore)
        ItemFunction.setHoldItem(this.player, this.itemStack)
    }
    public setCoordinate() {
        const item: ItemStack = ItemFunction.getHoldItem(this.player)
        const { x, y, z } = this.player.location
        const lore: string[] = item.getLore();
        lore[2] = ("x " + x)
        lore[3] = ("y " + y)
        lore[4] = ("z " + z)

        let index: number

        for (let i = 2; i < 4; i++) {
            index = lore[i].indexOf(".") + 2
            lore[i] = lore[i].slice(0, index)
        }

        item.setLore(lore)
    }
    public setSkill(sn: number) {
        const lore = this.itemStack.getLore()
        lore[5] = `skill ${sn}`
        this.itemStack.setLore(lore)
        ItemFunction.setHoldItem(this.player, this.itemStack)
    }
    private setLore() {
        switch (this.itemStack.typeId) {
            case "watts:dimension_knife":
                this.itemStack.setLore(["100", "100", "x -", "y -", "z -", "skill -"])
                break
            case "watts:dimension_sword":
                this.itemStack.setLore(["220", "220", "x -", "y -", "z -", "skill -"])
                break
        }
        ItemFunction.setHoldItem(this.player, this.itemStack)
    }

    public static attack(player: Player, v: Entity){
        const dw = new DimensionWeapon(player)
        const hp = (v.getComponent(EntityComponentTypes.Health) as EntityHealthComponent).currentValue
        const vx = v.location.x, vy = v.location.y ,vz = v.location.z
        const x = dw.getCoordinate()[0], y = dw.getCoordinate()[1], z = dw.getCoordinate()[2]
        const distance = Math.sqrt((vx - x) ^ 2 + (vy - y) ^ 2 + (vz - z) ^ 2)
        const consume = Math.min(100, Math.round(5 + 2 * distance) + Math.round(hp / 5))
        const energy = dw.getEnergy()
        if(energy < consume) {
            player.sendMessage("LOW ENERGY!!")
            return;
        }
        dw.setEnergy(energy - consume)
        v.teleport({x, y, z})
    }
    public static sneakAttack(player: Player){
        const dw = new DimensionWeapon(player)

    }

    public static use(player: Player) {
        const dw = new DimensionWeapon(player)
    }

    public static sneakUse(player: Player) {
        const dw = new DimensionWeapon(player)
        dimensionWeaponFormFunc(dw)
    }
}