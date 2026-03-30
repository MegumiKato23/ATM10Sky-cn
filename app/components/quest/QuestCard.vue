<script setup lang="ts">
import { computed } from 'vue'
import type { QuestRecord } from '~/types/quest'

const props = defineProps<{
  quest: QuestRecord
}>()

function normalizeQuestText(value: string) {
  return value.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim()
}

function splitParagraphs(value: string) {
  return normalizeQuestText(value)
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
}

const descriptionParagraphs = computed(() => {
  const description = props.quest.description || '该任务没有额外描述。'
  return splitParagraphs(description)
})

const englishDescriptionParagraphs = computed(() => {
  if (!props.quest.englishDescription) {
    return []
  }

  return splitParagraphs(props.quest.englishDescription)
})

const shortDescription = computed(() => {
  const description = descriptionParagraphs.value.join(' ')
  if (description.length <= 260) {
    return description
  }
  return `${description.slice(0, 260).trim()}...`
})

const englishShortDescription = computed(() => {
  const description = englishDescriptionParagraphs.value.join(' ')
  if (!description) {
    return ''
  }

  if (description.length <= 220) {
    return description
  }

  return `${description.slice(0, 220).trim()}...`
})

const questMeta = computed(() => {
  return `${props.quest.groupTitle} / ${props.quest.chapterTitle}`
})

const questMetaEnglish = computed(() => {
  const segments = [props.quest.groupEnglishTitle, props.quest.chapterEnglishTitle].filter(Boolean)
  return segments.join(' / ')
})

const rewardLabels = computed(() => props.quest.rewards.map(reward => reward.label).filter(Boolean))
</script>

<template>
  <article class="quest-card">
    <div class="quest-head">
      <div class="quest-copy">
        <p class="quest-meta">{{ questMeta }}</p>
        <p v-if="questMetaEnglish" class="quest-meta quest-meta-english">{{ questMetaEnglish }}</p>
        <h3 class="quest-title">{{ quest.title }}</h3>
        <p v-if="quest.englishTitle" class="quest-title-english">{{ quest.englishTitle }}</p>
        <p v-if="quest.subtitle" class="quest-subtitle">{{ quest.subtitle }}</p>
        <p v-if="quest.englishSubtitle" class="quest-subtitle quest-subtitle-english">{{ quest.englishSubtitle }}</p>
      </div>

      <div class="chip-row">
        <span v-if="quest.optional" class="status-chip">可选</span>
        <span v-if="quest.hidden" class="status-chip status-chip-hidden">隐藏</span>
        <span class="status-chip">{{ quest.taskCount }} 个条件</span>
      </div>
    </div>

    <p class="quest-description">{{ shortDescription }}</p>
    <p v-if="englishShortDescription" class="quest-description quest-description-english">{{ englishShortDescription }}</p>

    <div class="chip-row">
      <span
        v-for="title in quest.taskTitles.slice(0, 10)"
        :key="title"
        class="task-chip"
      >
        {{ title }}
      </span>
      <span
        v-if="quest.taskTitles.length > 10"
        class="task-chip"
      >
        +{{ quest.taskTitles.length - 10 }}
      </span>
    </div>

    <details class="quest-details">
      <summary class="quest-summary">展开详情</summary>
      <div class="quest-extra">
        <div>
          <strong>完整描述:</strong>
          <div class="detail-block">
            <p
              v-for="(paragraph, index) in descriptionParagraphs"
              :key="`zh-${index}`"
              class="detail-text"
            >
              {{ paragraph }}
            </p>
          </div>
          <div v-if="englishDescriptionParagraphs.length" class="detail-block detail-block-english">
            <p
              v-for="(paragraph, index) in englishDescriptionParagraphs"
              :key="`en-${index}`"
              class="detail-text"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
        <div><strong>任务类型:</strong> {{ quest.taskTypes.join('、') }}</div>
        <div v-if="rewardLabels.length">
          <strong>任务奖励:</strong>
          <div class="detail-block">
            <p
              v-for="reward in rewardLabels"
              :key="reward"
              class="detail-text"
            >
              {{ reward }}
            </p>
          </div>
        </div>
        <div><strong>前置任务:</strong> {{ quest.dependencyTitles.length ? quest.dependencyTitles.join('、') : '无' }}</div>
        <div><strong>任务 ID:</strong> {{ quest.id }}</div>
        <div><strong>来源章节文件:</strong> {{ quest.chapterFile }}</div>
      </div>
    </details>
  </article>
</template>

<style scoped>
.quest-card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface-strong);
  box-shadow: var(--shadow);
}

.chip-row {
  align-items: flex-start;
}

.quest-head {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: flex-start;
}

.quest-copy {
  display: grid;
  gap: 8px;
}

.quest-meta,
.quest-description,
.detail-text {
  margin: 0;
}

.quest-meta {
  color: var(--accent-alt);
  font-size: 0.84rem;
}

.quest-meta-english,
.quest-title-english,
.quest-subtitle-english,
.quest-description-english,
.detail-block-english {
  color: var(--text-soft);
}

.quest-title {
  margin: 0;
  font-family: var(--font-title);
  font-weight: 650;
}

.quest-title-english {
  margin: -2px 0 0;
}

.quest-subtitle {
  margin: 0;
  color: var(--accent);
}

.quest-description,
.detail-text {
  color: var(--text);
  line-height: 1.7;
}

.detail-text {
  white-space: pre-wrap;
}

.detail-block {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}

.quest-details {
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.quest-summary {
  cursor: pointer;
  color: var(--muted);
}

.quest-extra {
  display: grid;
  gap: 10px;
  margin-top: 12px;
  color: var(--muted);
  line-height: 1.6;
}

@media (max-width: 720px) {
  .quest-head {
    flex-direction: column;
  }
}
</style>
