import { Container, EntityInventoryComponent, ItemStack, Player, world, system } from "@minecraft/server";
import { scoreList } from "./data/scoreboard";


world.beforeEvents.worldInitialize.subscribe(() => {
    system.run(()=>{
        scoreList.forEach((obj) => {
            if(!world.scoreboard.getObjective(obj)){
                world.scoreboard.addObjective(obj)
            }
        })
    })
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    updateScore(ev.player, "mp", 100)
    updateScore(ev.player, "maxMp", 100)
    updateScore(ev.player, "xp", 0)
    updateScore(ev.player, "mp", 100)
    updateScore(ev.player, "lv", 1)
})

world.afterEvents.playerJoin.subscribe((ev) => {
})

function updateScore(player: Player, name: string, num: number){
    if(player.scoreboardIdentity == undefined){
        player.runCommandAsync(`scoreboard players set @s ${name} ${num}`)
    }
    if(world.scoreboard.getObjective(name)!.getScore(player.scoreboardIdentity!) == undefined){
        player.runCommandAsync(`scoreboard players set @s ${name} ${num}`)
    }
}

function getScore(player: Player, name: string): number{
    if(world.scoreboard.getObjective(name)!.getScore(player.scoreboardIdentity!) == undefined){
        return 0;
    }
    return world.scoreboard.getObjective(name)!.getScore(player.scoreboardIdentity!)!;
}


world.beforeEvents.chatSend.subscribe((ev) => {
    if (ev.message == "t") {
        ev.sender.runCommandAsync("title @s actionbar hp000100||000100mp000100||000100xp000100||000100lv000005")
    }
    if (ev.message == "lore") {
        let item = new ItemStack("minecraft:apple");
        system.run(() => {
            item.setLore(["test"])
            ev.sender.getComponent("minecraft:inventory")!.container!.addItem(item)
        });
    }
    if (ev.message == "lore1") {
        let item = new ItemStack("minecraft:apple");
        system.run(() => {
            item.setLore(["test1"])
            ev.sender.getComponent("minecraft:inventory")!.container!.addItem(item)
        });
    }
    if (ev.message == "lore2") {
        let item = new ItemStack("minecraft:apple");
        system.run(() => {
            item.setLore(["test", "aq1wqewq"])
            ev.sender.getComponent("minecraft:inventory")!.container!.addItem(item)
        });
    }
    if (ev.message == "lore3") {
        let item = new ItemStack("minecraft:apple");
        system.run(() => {
            item.setLore(["test", "test1", "test2"])
            ev.sender.getComponent("minecraft:inventory")!.container!.addItem(item)
        });
    }
});

system.runInterval(() => {
    world.getAllPlayers().forEach((player) => {
        let hp : String = "000000" + player.getComponent("minecraft:health")!.currentValue;
        let maxHp : String = "000000" + player.getComponent("minecraft:health")!.defaultValue;
        let mp : String = "000000" + getScore(player, "mp");
        let maxMp : String = "000000" + getScore(player, "maxMp");
        let xp : String = "000000" + getScore(player, "xp");
        let maxXp : String = "000000" + getScore(player, "maxXp");
        let lv : String = "000000" + getScore(player, "lv");
        hp = hp.substring(hp.length - 6);
        mp = mp.substring(mp.length - 6);
        xp = xp.substring(xp.length - 6);
        lv = lv.substring(lv.length - 6);
        maxHp = maxHp.substring(maxHp.length - 6);
        maxMp = maxMp.substring(maxMp.length - 6);
        maxXp = maxXp.substring(maxXp.length - 6);
        const container: Container = (player.getComponent("inventory") as EntityInventoryComponent).container!
        const item: ItemStack | undefined = container.getItem(player.selectedSlotIndex);
        let cooldown = "000000";
        if(item){
            if(item.hasComponent("cooldown")){
                cooldown = cooldown + player.getItemCooldown(item.getComponent("cooldown")!.cooldownCategory)
                cooldown = cooldown.substring(lv.length - 6);
                item.setLore([`cd:${cooldown}`])
                player.getComponent("minecraft:inventory")!.container!.setItem(player.selectedSlotIndex, item)
            }
        }
        player.runCommandAsync(`title @s actionbar hp${hp}||${maxHp}mp${mp}||${maxMp}xp${xp}||${maxXp}lv${lv}`)
    })
}, 1)