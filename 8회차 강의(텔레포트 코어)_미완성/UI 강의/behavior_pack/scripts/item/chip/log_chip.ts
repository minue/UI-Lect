import { Block, Container, Dimension, Entity, ItemStack, Player, world } from "@minecraft/server"
import { Spider } from "../../entity/spider"

class Log {
    id: string
    dimension: Dimension
    x: number
    y: number
    z: number
    constructor(id: string, x: number, y: number, z: number, dimension: string) {
        this.x = x
        this.y = y
        this.z = z
        this.id = id
        this.dimension = world.getDimension(dimension)
    }
    checkNearest() {
        this.dimension.getBlockAbove(this, { includePassableBlocks: true })
    }
    teleport(player: Player) {
        player.teleport(this, { dimension: this.dimension })
    }
}

export class LogChip {

    chip: ItemStack
    index: number
    log: string[]
    spider: Spider
    container: Container

    constructor(spider: Spider, container: Container, index: number, item: ItemStack) {
        this.spider = spider
        this.container = container
        this.index = index
        this.chip = item
        this.log = item.getLore()
    }
    addLog(str: string): ItemStack {
        if (this.log.length >= 50) {
            return this.chip
        }
        this.log.push(str)
        this.chip.setLore(this.log)
        this.container.setItem(this.index, this.chip)
        return this.chip
    }
    setLog(str: string[]): ItemStack {
        this.chip.setLore(str)
        this.container.setItem(this.index, this.chip)
        return this.chip
    }
    getLog(item: ItemStack): string[] {
        const log: string[] = item.getLore()
        this.log = log
        return log
    }
    canWrite(item: ItemStack): boolean {
        if (this.log.length >= 50) {
            return false
        }
        return true
    }
    static makeBlockLog(block: Block): string {
        const str = `block.log/x: ${block.x}/y: ${block.y}/z: ${block.z}/type: ${block.typeId}/dimension: ${block.dimension.id}`
        return str
    }
    static makeEntityLog(ent: Entity): string {
        const str = `ent.log/x: ${ent.location.x}/y: ${ent.location.y}/z: ${ent.location.z}/type: ${ent.typeId}/dimension: ${ent.dimension.id}`
        return str
    }
    blockLog(block: Block, logChip: LogChip): ItemStack {
        return logChip.addLog(LogChip.makeBlockLog(block))
    }
    entityLog(ent: Entity, logChip: LogChip): ItemStack {
        return logChip.addLog(LogChip.makeEntityLog(ent))
    }
    logInterpret(str: string): Log {
        const log: string[] = str.split("/")
        const x = parseFloat(log[0].replace("x: ", ""))
        const y = parseFloat(log[1].replace("y: ", ""))
        const z = parseFloat(log[2].replace("z: ", ""))
        const typeid = log[3].replace("type: ", "")
        const dimension = log[4].replace("dimension: ", "")
        return new Log(typeid, x, y, z, dimension)
    }
}