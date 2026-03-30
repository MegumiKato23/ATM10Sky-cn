<script setup lang="ts">
import type { ChapterGroupBucket } from '~/types/quest'

defineProps<{
  groups: ChapterGroupBucket[]
  activeChapterId: string
}>()

defineEmits<{
  select: [chapterId: string]
  reset: []
}>()
</script>

<template>
  <aside class="chapter-nav panel-card">
    <div class="section-heading">
      <h2 class="section-title">章节导航</h2>
      <button class="mini-button" type="button" @click="$emit('reset')">
        查看总览
      </button>
    </div>

    <div class="chapter-groups">
      <section
        v-for="group in groups"
        :key="group.id"
        class="chapter-group"
      >
        <div class="chapter-group-heading">
          <h3 class="chapter-group-title">{{ group.title }}</h3>
          <p v-if="group.englishTitle" class="chapter-group-english">{{ group.englishTitle }}</p>
        </div>
        <div class="chapter-list">
          <button
            v-for="chapter in group.chapters"
            :key="chapter.id"
            class="chapter-button"
            :class="{ 'chapter-button-active': chapter.id === activeChapterId }"
            type="button"
            @click="$emit('select', chapter.id)"
          >
            <span class="chapter-name">{{ chapter.title }}</span>
            <small v-if="chapter.englishTitle" class="chapter-name-english">{{ chapter.englishTitle }}</small>
            <small class="chapter-meta">
              {{ chapter.questCount }} 个任务<span v-if="chapter.hiddenQuestCount">
                · 隐藏 {{ chapter.hiddenQuestCount }}
              </span>
            </small>
          </button>
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.chapter-nav {
  display: grid;
  gap: 18px;
  align-self: start;
  position: sticky;
  top: var(--sticky-offset);
}

.section-heading {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  font-family: var(--font-title);
  font-weight: 650;
  font-size: 1.3rem;
}

.chapter-groups {
  display: grid;
  gap: 18px;
  max-height: calc(100vh - 160px);
  overflow: auto;
  padding-right: 4px;
}

.chapter-group {
  display: grid;
  gap: 8px;
}

.chapter-group-heading {
  display: grid;
  gap: 2px;
}

.chapter-group-title {
  margin: 0;
  color: var(--accent);
  font-size: 0.98rem;
}

.chapter-group-english {
  margin: 0;
  color: var(--text-faint);
  font-size: 0.78rem;
}

.chapter-list {
  display: grid;
  gap: 8px;
}

.chapter-button {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-strong);
  color: var(--text);
  text-align: left;
  padding: 10px 12px;
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
}

.chapter-button:hover {
  transform: translateY(-1px);
  border-color: var(--accent-border);
}

.chapter-button-active {
  border-color: var(--accent-border-strong);
  background: var(--surface-soft);
}

.chapter-name,
.chapter-name-english,
.chapter-meta {
  display: block;
}

.chapter-name-english {
  margin-top: 4px;
  color: var(--text-soft);
  line-height: 1.5;
}

.chapter-meta {
  margin-top: 6px;
  color: var(--muted);
}

@media (max-width: 1080px) {
  .chapter-groups {
    max-height: none;
  }
}
</style>
