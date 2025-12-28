import { EntityComponentTypes } from "@minecraft/server";
import { ItemFunction } from "./itemFunction";
import { dimensionWeaponFormFunc } from "../form/dimensionWeaponForm";
export class DimensionWeapon {
    constructor(player) {
        const itemStack = ItemFunction.getHoldItem(player);
        if (!(this.itemStack).getLore()) {
            this.setLore();
        }
        try {
            this.energy = parseInt(this.itemStack.getLore()[0]);
            this.maxEnergy = parseInt(this.itemStack.getLore()[1]);
        }
        catch (e) {
            this.setLore();
        }
        ItemFunction.setHoldItem(player, this.itemStack);
    }
    getPlayer() {
        return this.player;
    }
    getEnergy() {
        this.energy = parseInt(this.itemStack.getLore()[0]);
        return this.energy;
    }
    getMaxEnergy() {
        this.maxEnergy = parseInt(this.itemStack.getLore()[1]);
        return this.maxEnergy;
    }
    getSkill() {
        const sn = parseInt(this.itemStack.getLore()[5].replace("skill ", "")) - 1;
        return sn;
    }
    getCoordinate() {
        this.coordinate[0] = parseInt(this.itemStack.getLore()[2].replace("x ", ""));
        this.coordinate[1] = parseInt(this.itemStack.getLore()[3].replace("y ", ""));
        this.coordinate[2] = parseInt(this.itemStack.getLore()[4].replace("z ", ""));
        return this.coordinate;
    }
    setEnergy(energy) {
        if (energy != undefined) {
            this.energy = energy;
        }
        const lore = this.itemStack.getLore();
        lore[0] = `${this.energy}`;
        this.itemStack.setLore(lore);
        ItemFunction.setHoldItem(this.player, this.itemStack);
    }
    setMaxEnergy(maxEnergy) {
        if (maxEnergy != undefined) {
            this.maxEnergy = maxEnergy;
        }
        const lore = this.itemStack.getLore();
        lore[1] = `${this.maxEnergy}`;
        this.itemStack.setLore(lore);
        ItemFunction.setHoldItem(this.player, this.itemStack);
    }
    setCoordinate() {
        const item = ItemFunction.getHoldItem(this.player);
        const { x, y, z } = this.player.location;
        const lore = item.getLore();
        lore[2] = ("x " + x);
        lore[3] = ("y " + y);
        lore[4] = ("z " + z);
        let index;
        for (let i = 2; i < 4; i++) {
            index = lore[i].indexOf(".") + 2;
            lore[i] = lore[i].slice(0, index);
        }
        item.setLore(lore);
    }
    setSkill(sn) {
        const lore = this.itemStack.getLore();
        lore[5] = `skill ${sn}`;
        this.itemStack.setLore(lore);
        ItemFunction.setHoldItem(this.player, this.itemStack);
    }
    setLore() {
        switch (this.itemStack.typeId) {
            case "watts:dimension_knife":
                this.itemStack.setLore(["100", "100", "x -", "y -", "z -", "skill -"]);
                break;
            case "watts:dimension_sword":
                this.itemStack.setLore(["220", "220", "x -", "y -", "z -", "skill -"]);
                break;
        }
        ItemFunction.setHoldItem(this.player, this.itemStack);
    }
    static attack(player, v) {
        const dw = new DimensionWeapon(player);
        const hp = v.getComponent(EntityComponentTypes.Health).currentValue;
        const vx = v.location.x, vy = v.location.y, vz = v.location.z;
        const x = dw.getCoordinate()[0], y = dw.getCoordinate()[1], z = dw.getCoordinate()[2];
        const distance = Math.sqrt((vx - x) ^ 2 + (vy - y) ^ 2 + (vz - z) ^ 2);
        const consume = Math.min(100, Math.round(5 + 2 * distance) + Math.round(hp / 5));
        const energy = dw.getEnergy();
        if (energy < consume) {
            player.sendMessage("LOW ENERGY!!");
            return;
        }
        dw.setEnergy(energy - consume);
        v.teleport({ x, y, z });
    }
    static sneakAttack(player) {
        const dw = new DimensionWeapon(player);
    }
    static use(player) {
        const dw = new DimensionWeapon(player);
    }
    static sneakUse(player) {
        const dw = new DimensionWeapon(player);
        dimensionWeaponFormFunc(dw);
    }
}
