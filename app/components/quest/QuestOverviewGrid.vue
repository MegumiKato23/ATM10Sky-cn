<script setup lang="ts">
import type { OverviewChapter } from '~/types/quest'

defineProps<{
  chapters: OverviewChapter[]
}>()

defineEmits<{
  openChapter: [chapterId: string]
}>()
</script>

<template>
  <div class="overview-grid">
    <button
      v-for="chapter in chapters"
      :key="chapter.id"
      class="overview-card"
      type="button"
      @click="$emit('openChapter', chapter.id)"
    >
      <p class="overview-meta">
        {{ chapter.groupTitle }}<template v-if="chapter.groupEnglishTitle"> / {{ chapter.groupEnglishTitle }}</template>
      </p>
      <h3 class="overview-title">{{ chapter.title }}</h3>
      <p v-if="chapter.englishTitle" class="overview-english">{{ chapter.englishTitle }}</p>
      <p v-if="chapter.subtitle" class="overview-brief">{{ chapter.subtitle }}</p>
      <p v-if="chapter.englishSubtitle" class="overview-brief overview-brief-english">{{ chapter.englishSubtitle }}</p>
      <p class="overview-brief">
        {{ chapter.questCount }} 个任务<span v-if="chapter.hiddenQuestCount">
          ，隐藏 {{ chapter.hiddenQuestCount }} 个
        </span>
      </p>
      <p v-if="chapter.previewTitles.length" class="overview-brief">
        示例: {{ chapter.previewTitles.join('、') }}
      </p>
    </button>
  </div>
</template>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.overview-card {
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface-strong);
  color: var(--text);
  text-align: left;
  padding: 16px;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease;
}

.overview-card:hover {
  transform: translateY(-1px);
  border-color: var(--accent-border);
  background: var(--surface-soft);
}

.overview-meta,
.overview-brief {
  margin: 0;
}

.overview-meta {
  color: var(--accent-alt);
  font-size: 0.84rem;
}

.overview-title {
  margin: 8px 0 6px;
  font-family: var(--font-title);
  font-weight: 650;
}

.overview-english {
  margin: 0 0 10px;
  color: var(--text-soft);
}

.overview-brief {
  color: var(--muted);
  line-height: 1.6;
}

.overview-brief-english {
  margin-top: -2px;
}
</style>
