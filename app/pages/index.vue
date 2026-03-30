<script setup lang="ts">
import type { QuestDataset } from '~/types/quest'

const { data, pending, error } = await useFetch<QuestDataset>('/api/quests', {
  key: 'atm10-quest-data',
})

// 让模板访问 browser.xxx 时自动解包内部的 ref/computed。
const browser = reactive(useQuestBrowser(data))

const heroStats = computed(() => {
  if (!data.value) {
    return []
  }

  return [
    { label: '任务分组', value: data.value.meta.groupCount },
    { label: '章节总数', value: data.value.meta.chapterCount },
    { label: '任务总数', value: data.value.meta.questCount },
    { label: '可选 / 隐藏', value: `${data.value.meta.optionalQuestCount} / ${data.value.meta.hiddenQuestCount}` },
  ]
})

useSeoMeta({
  title: () => data.value?.meta.title ? `${data.value.meta.title} · Nuxt 任务查询` : 'ATM10 任务查询',
  description: 'ATM10 向天空进发汉化任务查询站，支持按任务中英文标题、任务分组、章节和隐藏状态检索。',
})
</script>

<template>
  <main class="page-shell">
    <section class="hero panel-card">
      <div class="hero-copy">
        <p class="eyebrow">ATM10 汉化补丁任务检索 · Nuxt 版</p>
        <h1 class="hero-title">{{ data?.meta.title ?? '任务查询站' }}</h1>
        <p v-if="data?.meta.englishTitle" class="hero-english">{{ data.meta.englishTitle }}</p>
        <p class="hero-summary">
          收录 {{ data?.meta.chapterCount ?? 0 }} 个章节、{{ data?.meta.questCount ?? 0 }} 个任务。
          支持按任务中英文标题、章节、分组和隐藏状态快速检索。
        </p>
      </div>

      <div class="hero-stats">
        <article
          v-for="stat in heroStats"
          :key="stat.label"
          class="stat-card"
        >
          <span>{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
        </article>
      </div>
    </section>

    <QuestSearchPanel
      v-if="data"
      v-model:query="browser.filters.query"
      v-model:group-id="browser.filters.groupId"
      v-model:chapter-id="browser.filters.chapterId"
      v-model:show-hidden="browser.filters.showHidden"
      :groups="data.groups"
      :chapters="browser.chaptersForSelectedGroup"
      @clear-all="browser.resetFilters"
      @update:group-id="browser.selectGroup"
      @update:chapter-id="browser.selectChapter"
    />

    <div v-if="pending" class="panel-card state-card">
      正在载入任务数据...
    </div>

    <div v-else-if="error || !data" class="panel-card state-card">
      无法读取任务数据，请先确认 `support/quest-browser/quests.json` 已生成。
    </div>

    <div v-else class="content-grid">
      <QuestChapterNav
        :groups="browser.chapterBuckets"
        :active-chapter-id="browser.filters.chapterId"
        @select="browser.selectChapter"
        @reset="browser.resetChapter"
      />

      <section class="main-column">
        <section class="panel-card summary-card">
          <div class="summary-heading">
            <h2 class="summary-title">结果</h2>
            <p class="summary-meta">{{ browser.resultsMeta }}</p>
          </div>

          <div v-if="browser.activeTags.length" class="filter-tags">
            <span
              v-for="tag in browser.activeTags"
              :key="tag"
              class="filter-tag"
            >
              {{ tag }}
            </span>
          </div>
          <p v-else class="summary-placeholder">当前为总览模式</p>
        </section>

        <QuestOverviewGrid
          v-if="browser.isOverviewMode"
          :chapters="browser.overviewChapters"
          @open-chapter="browser.selectChapter"
        />

        <QuestResults
          v-else
          :quests="browser.visibleQuests"
          :truncated="browser.hasTruncatedResults"
          :limit="browser.resultLimit"
        />
      </section>
    </div>
  </main>
</template>

<style scoped>
.page-shell {
  position: relative;
  z-index: 1;
  width: min(1480px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 28px 0 40px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(280px, 1fr);
  gap: 20px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 246, 242, 0.98));
}

.hero-copy,
.hero-stats {
  position: relative;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--accent-alt);
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-title {
  margin: 0;
  font-family: var(--font-title);
  font-weight: 700;
  font-size: clamp(2rem, 3.6vw, 3.2rem);
  line-height: 1.08;
  letter-spacing: 0.02em;
}

.hero-english {
  margin: 10px 0 0;
  color: var(--text-soft);
  font-size: 0.95rem;
  letter-spacing: 0.04em;
}

.hero-summary {
  max-width: 52rem;
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.7;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--surface-gradient);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 1.5rem;
}

.stat-card span {
  color: var(--muted);
  font-size: 0.88rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.main-column {
  display: grid;
  gap: 16px;
}

.summary-card,
.state-card {
  display: grid;
  gap: 14px;
}

.summary-heading {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.summary-title {
  margin: 0;
  font-family: var(--font-title);
  font-weight: 650;
  font-size: 1.35rem;
}

.summary-meta {
  margin: 0;
  color: var(--muted);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}

.filter-tag {
  display: inline-flex;
  align-items: flex-start;
  flex: 0 0 auto;
  max-width: 100%;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface-strong);
  font-size: 0.84rem;
  line-height: 1.45;
  word-break: break-word;
}

.summary-placeholder {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
}

@media (max-width: 1080px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .page-shell {
    width: min(100vw - 20px, 1480px);
    padding-top: 20px;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .hero-stats {
    grid-template-columns: 1fr;
  }

  .summary-heading {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
