// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods - AllTheMods 10.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.

ItemEvents.modifyTooltips((allthemods) => {
  //AllTheModium
  allthemods.add("allthemodium:teleport_pad", [Text.of("采矿维度已禁用")])
  //Ars Controle
  allthemods.add("ars_controle:scryers_linkage", [
    Text.of(""),
    Text.of("§7虚假搜索别名:"),
    Text.of("§7- 纠缠"),
    Text.of("§7- 纠缠方块")
  ])

  //Forbidden Arcanus
  allthemods.add("forbidden_arcanus:hephaestus_forge_tier_1", [
    Text.of("§c§l潜行右击§r§c §c§l锻造台§r§c 并使用 §l蒙达比特粉尘"),
    Text.of("§c█ = 镀金錾制磨光暗石,顶部放置锻造台"),
    Text.of("§7█ = 磨光暗石"),
    Text.of("§5█§7 = 镀金錾制磨光暗石"),
    Text.of("§6█§7 = 錾制奥术磨光暗石"),
    Text.of("§0███§7███§0███"),
    Text.of("§0█§7███§5█§7███§0█"),
    Text.of("§0█§7█§5█§7███§5█§7█§0█"),
    Text.of("§7████§6█§7████"),
    Text.of("§7█§5█§7█§6█§c█§6█§7█§5█§7█"),
    Text.of("§7████§6█§7████"),
    Text.of("§0█§7█§5█§7███§5█§7█§0█"),
    Text.of("§0█§7███§5█§7███§0█"),
    Text.of("§0███§7███§0███")
  ])
  allthemods.add("forbidden_arcanus:clibano_core", [
    Text.of("§c§l潜行右击§r§c §c§l克里巴诺核心§r§c 并使用 §c§l蒙达比特粉尘"),
    Text.of("§5█§7 = 磨光暗石"),
    Text.of("§7█ = 磨光暗石砖"),
    Text.of("§6█§7 = 克里巴诺核心"),
    Text.of("§7从右到左 -> 从下到上"),
    Text.of("§5█§7█§5█§0█§7███§0█§5█§7█§5█"),
    Text.of("§7███§0█§7█§0█§7█§0█§7███"),
    Text.of("§5█§7█§5█§0█§7█§6█§7█§0█§5█§7█§5█")
  ])
  allthemods.add("forbidden_arcanus:growing_edelwood", [
    Text.of("§4可从流浪商人处获得"),
    Text.of("§4或对橡树树苗使用腐化之魂")
  ])
  allthemods.add("forbidden_arcanus:magnetized_darkstone_pedestal", [
    Text.of("§7对暗石基座使用铁磁混合物")
  ])
  allthemods.add("forbidden_arcanus:soul", [Text.of("§7对灵魂沙使用灵魂提取器")])
  allthemods.add("forbidden_arcanus:enchanted_soul", [Text.of("§7对普通灵魂使用喷溅型奥瑞尔瓶")])
  allthemods.add("forbidden_arcanus:corrupt_soul", [Text.of("§7击杀生物时罕见生成")])
  allthemods.add("forbidden_arcanus:blood_test_tube", [
    Text.of("§7副手持试管,然后击杀生物")
  ])
  allthemods.add("forbidden_arcanus:xpetrified_orb", [
    Text.of("§7仅可通过黑洞获得"),
    Text.of("§7制造黑洞:将暗物质与腐化粉尘一起扔在地上"),
    Text.of("§7喂食足够经验使其吐出石化宝珠")
  ])
  allthemods.add("forbidden_arcanus:dragon_scale", [Text.of("§7由末影龙掉落")])
  allthemods.add("forbidden_arcanus:crescent_moon", [Text.of("§c无法获得")])
  allthemods.add("forbidden_arcanus:soul_crimson_stone", [Text.of("§c使用1次后将变为绯红石")])

  //Mystical Agriculture
  allthemods.add(/mysticalagriculture:.*watering_can/, [
    Text.of("§c对虚假玩家禁用"),
    Text.of("§c(例如模块化路由器、点击器等方块)")
  ])
  //Occultism
  allthemods.add("kubejs:ritual_dummy/honeycomb", [Text.of("§7等级:弗利奥特")])
  allthemods.add("kubejs:ritual_dummy/misc_demonic_sapling", [Text.of("§7等级:狂野")])

  //Create
  allthemods.add("create:limestone", [Text.of("让熔岩源方块在机械动力蜂蜜上流动").gray()])

  allthemods.add("create:scoria", [Text.of("让熔岩源方块在机械动力巧克力上流动").gray()])
  // Botany Pot warning for Sculk
  allthemods.add(
    [
      "minecraft:sculk",
      "minecraft:sculk_sensor",
      "minecraft:sculk_catalyst",
      "minecraft:sculk_vein",
      "minecraft:sculk_shrieker"
    ],
    [Text.of("§9在植物盆中:需要带有精准采集附魔的锄才能收获")]
  )
  // Apotheosis Gateway Warning
  allthemods.add(
    [
      'gateways:gate_pearl[gateways:gateway="apotheosis:tiered/frontier"]',
      'gateways:gate_pearl[gateways:gateway="apotheosis:tiered/ascent"]',
      'gateways:gate_pearl[gateways:gateway="apotheosis:tiered/summit"]',
      'gateways:gate_pearl[gateways:gateway="apotheosis:tiered/pinnacle"]'
    ],
    [Text.of("§c警告:在紧凑机器或AE2空间存储中,第3波时会内爆")]
  )
})

// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods - AllTheMods 10.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
