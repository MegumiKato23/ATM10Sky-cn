const $BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries")

StartupEvents.registry("item", (allthemods) => {
  allthemods.create("silent_allthemodium_plate").displayName("寂静全能金属板").glow(true)
  allthemods.create("silent_vibranium_plate").displayName("寂静振金板").glow(true)
  allthemods.create("silent_unobtainium_plate").displayName("寂静难以获取板").glow(true)
})
