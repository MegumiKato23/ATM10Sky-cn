<template>
  <div class="layout-shell">
    <div class="layout-grid" aria-hidden="true" />
    <slot />
  </div>
</template>

<style scoped>
.layout-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 0%, var(--mesh-gold), transparent 24rem),
    radial-gradient(circle at 88% 8%, var(--mesh-teal), transparent 22rem),
    linear-gradient(180deg, var(--page-bg-top) 0%, var(--page-bg) 58%, var(--page-bg-bottom) 100%);
}

.layout-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 56px 56px;
  opacity: 0.5;
  pointer-events: none;
}
</style>
