import { computed, nextTick, reactive, shallowRef, watch, type Ref } from 'vue'
import type {
  ChapterGroupBucket,
  OverviewChapter,
  QuestChapter,
  QuestDataset,
  QuestFilters,
  QuestGroup,
  QuestRecord,
} from '~/types/quest'

function normalizeForMatch(value: string) {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function getTitleKeywordPosition(title: string, query: string, needles: string[]) {
  if (!title) {
    return -1
  }

  if (query && title.includes(query)) {
    return title.indexOf(query)
  }

  if (!needles.length) {
    return -1
  }

  const positions = needles.map(needle => title.indexOf(needle))

  if (positions.some(position => position === -1)) {
    return -1
  }

  return Math.min(...positions)
}

function getQuestTitleMatchPosition(quest: QuestRecord, query: string, needles: string[]) {
  const positions = [
    getTitleKeywordPosition(normalizeForMatch(quest.title), query, needles),
    getTitleKeywordPosition(normalizeForMatch(quest.englishTitle), query, needles),
  ].filter(position => position >= 0)

  return positions.length ? Math.min(...positions) : -1
}

function createEmptyFilters(): QuestFilters {
  return {
    query: '',
    groupId: '',
    chapterId: '',
    showHidden: false,
  }
}

export function useQuestBrowser(dataset: Ref<QuestDataset | null | undefined>) {
  const route = useRoute()
  const router = useRouter()
  const syncingFromRoute = shallowRef(false)
  const filters = reactive<QuestFilters>(createEmptyFilters())
  const resultLimit = 250

  const groupMap = computed(() => {
    const map = new Map<string, QuestGroup>()
    for (const group of dataset.value?.groups ?? []) {
      map.set(group.id, group)
    }
    return map
  })

  const chapterMap = computed(() => {
    const map = new Map<string, QuestChapter>()
    for (const chapter of dataset.value?.chapters ?? []) {
      map.set(chapter.id, chapter)
    }
    return map
  })

  const questsByChapter = computed(() => {
    const map = new Map<string, QuestRecord[]>()

    for (const quest of dataset.value?.quests ?? []) {
      const list = map.get(quest.chapterId) ?? []
      list.push(quest)
      map.set(quest.chapterId, list)
    }

    return map
  })

  const visibleQuestCountByChapter = computed(() => {
    const map = new Map<string, number>()

    for (const chapter of dataset.value?.chapters ?? []) {
      const visibleCount = (questsByChapter.value.get(chapter.id) ?? [])
        .filter(quest => filters.showHidden || !quest.hidden)
        .length

      if (visibleCount > 0) {
        map.set(chapter.id, visibleCount)
      }
    }

    return map
  })

  const visibleChapters = computed(() => {
    return (dataset.value?.chapters ?? []).filter((chapter: QuestChapter) => visibleQuestCountByChapter.value.has(chapter.id))
  })

  function syncFiltersFromRoute() {
    syncingFromRoute.value = true
    filters.query = typeof route.query.q === 'string' ? route.query.q : ''
    filters.groupId = typeof route.query.group === 'string' ? route.query.group : ''
    filters.chapterId = typeof route.query.chapter === 'string' ? route.query.chapter : ''
    filters.showHidden = route.query.hidden === '1'

    if (filters.chapterId) {
      const chapter = chapterMap.value.get(filters.chapterId)
      if (chapter && !filters.groupId) {
        filters.groupId = chapter.groupId
      }
    }

    void nextTick(() => {
      syncingFromRoute.value = false
    })
  }

  watch(
    () => [route.query.q, route.query.group, route.query.chapter, route.query.hidden, dataset.value?.chapters.length],
    () => {
      syncFiltersFromRoute()
    },
    { immediate: true },
  )

  watch(
    () => [filters.query, filters.groupId, filters.chapterId, filters.showHidden] as const,
    async () => {
      if (syncingFromRoute.value) {
        return
      }

      const nextQuery: Record<string, string> = {}
      if (filters.query.trim()) {
        nextQuery.q = filters.query.trim()
      }
      if (filters.groupId) {
        nextQuery.group = filters.groupId
      }
      if (filters.chapterId) {
        nextQuery.chapter = filters.chapterId
      }
      if (filters.showHidden) {
        nextQuery.hidden = '1'
      }

      const currentQuery = new URLSearchParams(route.query as Record<string, string>).toString()
      const targetQuery = new URLSearchParams(nextQuery).toString()

      if (currentQuery !== targetQuery) {
        await router.replace({ query: nextQuery })
      }
    },
  )

  watch(
    () => [filters.chapterId, filters.groupId, filters.showHidden, visibleChapters.value.length] as const,
    () => {
      if (filters.chapterId && !visibleQuestCountByChapter.value.has(filters.chapterId)) {
        filters.chapterId = ''
      }

      if (filters.groupId && !chaptersForSelectedGroup.value.length) {
        filters.groupId = ''
      }
    },
  )

  const chaptersForSelectedGroup = computed(() => {
    const chapters = visibleChapters.value
    if (!filters.groupId) {
      return chapters
    }
    return chapters.filter((chapter: QuestChapter) => chapter.groupId === filters.groupId)
  })

  const chapterBuckets = computed<ChapterGroupBucket[]>(() => {
    const buckets = new Map<string, ChapterGroupBucket>()

    for (const chapter of chaptersForSelectedGroup.value) {
      if (!buckets.has(chapter.groupId)) {
        buckets.set(chapter.groupId, {
          id: chapter.groupId,
          title: chapter.groupTitle || '未分组',
          englishTitle: chapter.groupEnglishTitle || '',
          chapters: [],
        })
      }
      buckets.get(chapter.groupId)?.chapters.push(chapter)
    }

    const orderedBuckets: ChapterGroupBucket[] = []

    for (const group of dataset.value?.groups ?? []) {
      const bucket = buckets.get(group.id)
      if (bucket) {
        orderedBuckets.push(bucket)
        buckets.delete(group.id)
      }
    }

    return [...orderedBuckets, ...buckets.values()]
  })

  const isOverviewMode = computed(() => {
    return !filters.query.trim() && !filters.groupId && !filters.chapterId && !filters.showHidden
  })

  const filteredQuests = computed(() => {
    const quests = dataset.value?.quests ?? []
    const normalizedQuery = normalizeForMatch(filters.query)
    const needles = normalizedQuery.split(' ').filter(Boolean)

    return quests
      .filter((quest: QuestRecord) => filters.showHidden || !quest.hidden)
      .filter((quest: QuestRecord) => !filters.groupId || quest.groupId === filters.groupId)
      .filter((quest: QuestRecord) => !filters.chapterId || quest.chapterId === filters.chapterId)
      .filter((quest: QuestRecord) => {
        if (!needles.length) {
          return true
        }
        return getQuestTitleMatchPosition(quest, normalizedQuery, needles) >= 0
      })
      .sort((left: QuestRecord, right: QuestRecord) => {
        const leftMatchPosition = getQuestTitleMatchPosition(left, normalizedQuery, needles)
        const rightMatchPosition = getQuestTitleMatchPosition(right, normalizedQuery, needles)
        const matchPositionDelta = leftMatchPosition - rightMatchPosition

        if (matchPositionDelta !== 0) {
          return matchPositionDelta
        }

        const chapterDelta =
          (chapterMap.value.get(left.chapterId)?.orderIndex ?? 0) -
          (chapterMap.value.get(right.chapterId)?.orderIndex ?? 0)

        if (chapterDelta !== 0) {
          return chapterDelta
        }

        return left.title.localeCompare(right.title, 'zh-Hans-CN')
      })
  })

  const visibleQuests = computed(() => filteredQuests.value.slice(0, resultLimit))
  const hasTruncatedResults = computed(() => filteredQuests.value.length > resultLimit)

  const overviewChapters = computed<OverviewChapter[]>(() => {
    return visibleChapters.value.map((chapter: QuestChapter) => {
      const previewTitles = (questsByChapter.value.get(chapter.id) ?? [])
        .filter(quest => filters.showHidden || !quest.hidden)
        .slice(0, 3)
        .map(quest => quest.title)

      return {
        ...chapter,
        previewTitles,
      }
    })
  })

  const activeTags = computed(() => {
    const tags: string[] = []
    if (filters.query.trim()) {
      tags.push(`关键词: ${filters.query.trim()}`)
    }
    if (filters.groupId) {
      tags.push(`分组: ${groupMap.value.get(filters.groupId)?.title ?? filters.groupId}`)
    }
    if (filters.chapterId) {
      tags.push(`章节: ${chapterMap.value.get(filters.chapterId)?.title ?? filters.chapterId}`)
    }
    if (filters.showHidden) {
      tags.push('包含隐藏任务')
    }
    return tags
  })

  const resultsMeta = computed(() => {
    if (isOverviewMode.value) {
      return '未启用筛选时显示章节总览。'
    }
    if (hasTruncatedResults.value) {
      return `共匹配 ${filteredQuests.value.length} 个任务，当前显示前 ${resultLimit} 个。`
    }
    return `共匹配 ${filteredQuests.value.length} 个任务。`
  })

  function selectChapter(chapterId: string) {
    filters.chapterId = chapterId
    const chapter = chapterMap.value.get(chapterId)
    if (chapter) {
      filters.groupId = chapter.groupId
    }
  }

  function selectGroup(groupId: string) {
    filters.groupId = groupId
    if (filters.chapterId) {
      const chapter = chapterMap.value.get(filters.chapterId)
      if (chapter?.groupId !== groupId) {
        filters.chapterId = ''
      }
    }
  }

  function resetChapter() {
    filters.chapterId = ''
    filters.groupId = ''
  }

  function resetFilters() {
    Object.assign(filters, createEmptyFilters())
  }

  return {
    filters,
    groupMap,
    chapterMap,
    chapterBuckets,
    chaptersForSelectedGroup,
    filteredQuests,
    visibleQuests,
    hasTruncatedResults,
    overviewChapters,
    activeTags,
    isOverviewMode,
    resultsMeta,
    resultLimit,
    selectChapter,
    selectGroup,
    resetChapter,
    resetFilters,
  }
}
