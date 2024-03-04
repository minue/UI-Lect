export const ReinforceItem = {
    "minecraft:iron_sword": [
        {
            itemName: "minecraft:iron_sword",
            text: "watts.item.craft",
            block: "watts:test",
            texture: "textures/watts/item/sword",
            success: 60,
            fail: 40,
            resultTexture: "textures/watts/item/black_sword",
            resultItemName: "watts:black_sword",
            need: [
                { "minecraft:iron_ingot": 1 },
                { "minecraft:netherite_ingot": 3 },
                { "minecraft:chorus_fruit_popped": 2 },
            ],
            plus: [
                { "watts:iron_flower": 30 }
            ],
            add: [
                { "watts:dragon_wing": { "%knockback_wind.1.40": 30 } },
                { "watts:jewel": { "%critical.1.20": 10 } },
                { "minecraft:string": { "%slow.1.20": 20 } },
                { "minecraft:ender_pearl": { "%skil.tleleport.100": 5 } },
            ]
        },
    ],
    "watts:black_sword": [
        {
            itemName: "watts:black_sword",
            text: "watts.item.craft",
            block: "watts:test",
            texture: "textures/watts/item/sword",
            success: 40,
            fail: 60,
            resultTexture: "textures/watts/item/result_sword",
            resultItemName: "watts:result_sword",
            need: [
                { "minecraft:iron_ingot": 1 },
                { "minecraft:netherite_ingot": 3 },
                { "minecraft:chorus_fruit_popped": 5 },
                { "watts:ewel": 1 },
            ],
            plus: [
                { "watts:iron_flower": 30 },
                { "watts:dragon_eye": 100 }
            ],
            add: [
                { "watts:dragon_wing": { "%knockback_wind.1.40": 40 } },
                { "watts:jewel": { "%critical.1.40": 20 } },
                { "watts:tooth": { "%drain.1.4": 40 } },
                { "minecraft:string": { "%slow.1.20": 20 } },
                { "minecraft:ender_pearl": { "%skil.teleport": 5 } },
            ]
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
                { "watts:dragon_wing": { "%knockback_wind.1.40": 30 } },
                { "watts:jewel": { "%critical.1.20": 10 } },
                { "minecraft:string": { "%slow.1.20": 20 } },
                { "minecraft:ender_pearl": { "%skil.teleport": 5 } },
            ]
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
            resultItemName: "watts:black_sword",
            need: [],
            plus: [],
            add: [
                { "watts:dragon_wing": { "%knockback_wind.1.40": 40 } },
                { "watts:jewel": { "%critical.1.40": 20 } },
                { "watts:tooth": { "%drain.1.4": 40 } },
                { "minecraft:string": { "%slow.1.20": 20 } },
                { "minecraft:ender_pearl": { "%skil.teleport": 5 } },
            ]
        }
    ]
};
