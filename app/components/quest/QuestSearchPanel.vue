<script setup lang="ts">
import type { QuestChapter, QuestGroup } from '~/types/quest'

defineProps<{
  groups: QuestGroup[]
  chapters: QuestChapter[]
}>()

defineEmits<{
  clearAll: []
}>()

const query = defineModel<string>('query', { default: '' })
const groupId = defineModel<string>('groupId', { default: '' })
const chapterId = defineModel<string>('chapterId', { default: '' })
const showHidden = defineModel<boolean>('showHidden', { default: false })
</script>

<template>
  <section class="quest-search panel-card">
    <label class="search-box" for="quest-search-input">
      <span class="search-label">关键词</span>
      <input
        id="quest-search-input"
        v-model="query"
        class="search-input"
        type="search"
        placeholder="输入任务名、章节名、描述、物品 ID 或任务条件"
        autocomplete="off"
      >
    </label>

    <div class="filter-grid">
      <label class="filter-field" for="quest-group-select">
        <span class="filter-label">任务分组</span>
        <select id="quest-group-select" v-model="groupId" class="filter-select">
          <option value="">全部分组</option>
          <option
            v-for="group in groups"
            :key="group.id"
            :value="group.id"
          >
            {{ group.title }}<template v-if="group.englishTitle"> / {{ group.englishTitle }}</template>
          </option>
        </select>
      </label>

      <label class="filter-field" for="quest-chapter-select">
        <span class="filter-label">章节</span>
        <select id="quest-chapter-select" v-model="chapterId" class="filter-select">
          <option value="">全部章节</option>
          <option
            v-for="chapter in chapters"
            :key="chapter.id"
            :value="chapter.id"
          >
            {{ chapter.title }}<template v-if="chapter.englishTitle"> / {{ chapter.englishTitle }}</template> · {{ chapter.questCount }} 个任务
          </option>
        </select>
      </label>

      <label class="toggle-field" for="quest-hidden-toggle">
        <input id="quest-hidden-toggle" v-model="showHidden" type="checkbox">
        <span>显示隐藏任务</span>
      </label>

      <button class="ghost-button" type="button" @click="$emit('clearAll')">
        清空筛选
      </button>
    </div>
  </section>
</template>

<style scoped>
.quest-search {
  display: grid;
  gap: 14px;
}

.search-box,
.filter-field {
  display: grid;
  gap: 10px;
}

.search-label,
.filter-label {
  color: var(--muted);
  font-size: 0.88rem;
}

.search-input,
.filter-select {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-strong);
  color: var(--text);
  padding: 14px 18px;
  outline: none;
}

.search-input:focus,
.filter-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft-strong);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: end;
}

.toggle-field {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  min-height: 48px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.toggle-field input {
  accent-color: var(--accent);
}

@media (max-width: 920px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
