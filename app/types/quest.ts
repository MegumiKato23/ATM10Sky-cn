export interface QuestMeta {
  title: string
  englishTitle: string
  generatedAt: string
  chapterCount: number
  questCount: number
  groupCount: number
  hiddenQuestCount: number
  optionalQuestCount: number
}

export interface QuestGroup {
  id: string
  title: string
  englishTitle: string
  chapterCount: number
  questCount: number
}

export interface QuestChapter {
  id: string
  filename: string
  fileName: string
  title: string
  englishTitle: string
  subtitle: string
  englishSubtitle: string
  groupId: string
  groupTitle: string
  groupEnglishTitle: string
  orderIndex: number
  questCount: number
  hiddenQuestCount: number
  optionalQuestCount: number
}

export interface QuestRecord {
  id: string
  title: string
  englishTitle: string
  subtitle: string
  englishSubtitle: string
  description: string
  englishDescription: string
  chapterId: string
  chapterTitle: string
  chapterEnglishTitle: string
  chapterSubtitle: string
  chapterEnglishSubtitle: string
  chapterFile: string
  groupId: string
  groupTitle: string
  groupEnglishTitle: string
  optional: boolean
  hidden: boolean
  dependencies: string[]
  dependencyTitles: string[]
  taskIds: string[]
  taskTitles: string[]
  taskTypes: string[]
  taskCount: number
  rewards: QuestReward[]
  sourceFile: string
  sourceLangFile: string
  searchText: string
}

export interface QuestReward {
  id: string
  type: string
  label: string
}

export interface QuestDataset {
  meta: QuestMeta
  groups: QuestGroup[]
  chapters: QuestChapter[]
  quests: QuestRecord[]
}

export interface QuestFilters {
  query: string
  groupId: string
  chapterId: string
  showHidden: boolean
}

export interface ChapterGroupBucket {
  id: string
  title: string
  englishTitle: string
  chapters: QuestChapter[]
}

export interface OverviewChapter extends QuestChapter {
  previewTitles: string[]
}
