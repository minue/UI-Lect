export function makeTable() {
    const table = {
        need: [],
        add: [],
        change: [],
        enough: false
    };
    for (let i = 0; i < 6; i++) {
        table.add.push({
            item: null,
            count: 0,
            need: false,
            effect: null,
            percent: 0,
            texture: null
        });
    }
    return table;
}
export const ReinforceItem = {
    "minecraft:iron_sword": [
        {
            itemName: "minecraft:iron_sword",
            text: "watts.item.craft",
            block: "watts:test",
            texture: "textures/items/iron_sword",
            success: 60,
            fail: 40,
            resultTexture: "textures/watts/item/black_sword",
            resultItemName: "watts:black_sword",
            need: [
                ["minecraft:iron_ingot", 1, "textures/items/iron_ingot"],
                ["minecraft:netherite_ingot", 3, "textures/items/netherite_ingot"],
                ["minecraft:popped_chorus_fruit", 2, "textures/items/chorus_fruit_popped"],
            ],
            plus: [
                ["watts:iron_flower", 30, "textures/watts/item/iron_flower"]
            ],
            add: [
                ["watts:dragon_wing", ["knockback_wind.1.40", 30], "textures/watts/item/dragon_wing"],
                ["watts:jewel", ["critical.20.20", 10], "textures/watts/item/jewel"],
                ["minecraft:string", ["slow.1.20", 20], "textures/items/string"],
                ["minecraft:ender_pearl", ["skill.tleleport", 5], "textures/items/ender_pearl"],
            ],
            change: {}
        },
    ],
    "watts:black_sword": [
        {
            itemName: "watts:black_sword",
            text: "watts.item.craft",
            block: "watts:test",
            texture: "textures/watts/item/black_sword",
            success: 40,
            fail: 60,
            resultTexture: "textures/watts/item/result_sword",
            resultItemName: "watts:result_sword",
            need: [
                ["minecraft:iron_ingot", 1, "textures/items/iron_ingot"],
                ["minecraft:netherite_ingot", 3, "textures/items/netherite_ingot"],
                ["minecraft:popped_chorus_fruit", 5, "textures/items/chorus_fruit_popped"],
                ["watts:jewel", 1, "textures/watts/item/jewel"],
            ],
            plus: [
                ["watts:iron_flower", 3, "textures/watts/item/iron_flower"],
                ["watts:dragon_eye", 100, "textures/watts/item/dragon_eye"]
            ],
            add: [
                ["watts:dragon_wing", ["knockback_wind.1.40", 40], "textures/watts/item/dragon_wing"],
                ["watts:jewel", ["critical.26.40", 20], "textures/watts/item/jewel"],
                ["watts:tooth", ["drain.100.1", 40], "textures/watts/item/tooth"],
                ["minecraft:string", ["slow.1.20", 20], "textures/items/string"],
                ["minecraft:ender_pearl", ["skill.move.teleport.25.100.100", 5], "textures/items/ender_pearl"],
            ],
            change: { "critical.20.20": "critical.26.40" }
        },
        {
            itemName: "watts:black_sword",
            text: "watts.item.upgrade",
            block: "watts:test",
            texture: "textures/watts/item/black_sword",
            success: 100,
            fail: 0,
            resultTexture: "textures/watts/item/black_sword",
            resultItemName: "watts:black_sword",
            need: [],
            plus: [],
            add: [
                ["watts:dragon_wing", ["knockback_wind.1.40", 30], "textures/watts/item/dragon_wing"],
                ["watts:jewel", ["critical.20.20", 10], "textures/watts/item/jewel"],
                ["minecraft:string", ["slow.1.20", 20], "textures/items/string"],
                ["minecraft:ender_pearl", ["skill.move.teleport.25.100.100", 5], "textures/items/ender_pearl"],
            ],
            change: {}
        }
    ],
    "watts:result_sword": [
        {
            itemName: "watts:result_sword",
            text: "watts.item.upgrade",
            block: "watts:test",
            texture: "textures/watts/item/result_sword",
            success: 100,
            fail: 0,
            resultTexture: "textures/watts/item/result_sword",
            resultItemName: "watts:result_sword",
            need: [],
            plus: [],
            add: [
                ["watts:dragon_wing", ["knockback_wind.1.40", 40], "textures/watts/item/dragon_wing"],
                ["watts:jewel", ["critical.26.40", 20], "textures/watts/item/jewel"],
                ["watts:tooth", ["drain.100.1", 40], "textures/watts/item/tooth"],
                ["minecraft:string", ["slow.1.20", 20], "textures/items/string"],
                ["minecraft:ender_pearl", ["skill.move.teleport.25.100.100", 5], "textures/items/ender_pearl"],
                ["minecraft:gunpowder", ["skill.move.dash.15.60.5", 5], "textures/items/gunpowder"],
                ["minecraft:feather", ["skill.sp1.gale.50.200.6", 5], "textures/items/feather"],
            ],
            change: {}
        }
    ]
};
