<script setup lang="ts">
import type { QuestRecord } from '~/types/quest'

defineProps<{
  quests: QuestRecord[]
  truncated: boolean
  limit: number
}>()
</script>

<template>
  <div class="results-wrap">
    <div v-if="truncated" class="truncated-note panel-card">
      匹配结果较多，当前先展示前 {{ limit }} 个任务。继续收窄关键词会更快。
    </div>

    <div v-if="quests.length" class="results-list">
      <QuestCard
        v-for="quest in quests"
        :key="quest.id"
        :quest="quest"
      />
    </div>

    <article v-else class="empty-state panel-card">
      <h3 class="empty-title">没有找到匹配任务</h3>
      <p class="empty-copy">可以尝试换个关键词，或取消章节和隐藏任务限制。</p>
    </article>
  </div>
</template>

<style scoped>
.results-wrap,
.results-list {
  display: grid;
  gap: 16px;
}

.truncated-note {
  color: var(--muted);
  background: var(--surface-soft);
}

.empty-state {
  width: 100%;
  max-width: 42rem;
  justify-self: center;
  text-align: center;
  padding: 42px 24px;
  background: var(--surface-strong);
  border-style: dashed;
}

.empty-title,
.empty-copy {
  margin: 0;
}

.empty-title {
  font-family: var(--font-title);
  font-weight: 650;
}

.empty-copy {
  margin-top: 12px;
  color: var(--muted);
}
</style>
