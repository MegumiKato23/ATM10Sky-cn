#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', '..');
const supportDir = path.join(rootDir, 'support');
const questsRoot = path.join(supportDir, 'config', 'ftbquests', 'quests');
const langRoot = path.join(questsRoot, 'lang', 'zh_cn');
const mergedLangFile = path.join(questsRoot, 'lang', 'zh_cn.snbt');
const chaptersRoot = path.join(questsRoot, 'chapters');
const rewardTablesRoot = path.join(questsRoot, 'reward_tables');
const langChaptersRoot = path.join(langRoot, 'chapters');
const compareQuestsRoot = path.join(supportDir, '中英对照版任务', 'ftbquests', 'quests');
const compareLangRoot = path.join(supportDir, '中英对照版任务', 'ftbquests', 'quests', 'lang', 'zh_cn');
const compareMergedLangFile = path.join(compareQuestsRoot, 'lang', 'zh_cn.snbt');
const compareChaptersRoot = path.join(compareQuestsRoot, 'chapters');
const compareLangChaptersRoot = path.join(compareLangRoot, 'chapters');
const outputDir = path.join(supportDir, 'quest-browser');

const PACK_FILE = path.join(langRoot, 'file.snbt');
const CHAPTER_LANG_FILE = path.join(langRoot, 'chapter.snbt');
const CHAPTER_GROUP_LANG_FILE = path.join(langRoot, 'chapter_group.snbt');
const REWARD_TABLE_LANG_FILE = path.join(langRoot, 'reward_table.snbt');
const COMPARE_PACK_FILE = path.join(compareLangRoot, 'file.snbt');
const COMPARE_CHAPTER_LANG_FILE = path.join(compareLangRoot, 'chapter.snbt');
const COMPARE_CHAPTER_GROUP_LANG_FILE = path.join(compareLangRoot, 'chapter_group.snbt');
const COMPARE_REWARD_TABLE_LANG_FILE = path.join(compareLangRoot, 'reward_table.snbt');

const TOP_LEVEL_GROUPS = [
  { id: 'skyblock', title: '空岛任务', englishTitle: 'Skyblock Quests', order: 0 },
  { id: 'basics', title: '基础知识', englishTitle: 'Basic Knowledge', order: 1 },
  { id: 'tech', title: '科技发展', englishTitle: 'Tech Progression', order: 2 },
  { id: 'mods', title: '模组专属任务', englishTitle: 'Mod-specific Quests', order: 3 },
  { id: 'ungrouped', title: '未分组', englishTitle: '', order: 4 },
];

// 用文件名做稳定映射，避免标题调整后分类漂移。
const TOP_LEVEL_GROUP_BY_FILE = new Map([
  ['welcome', 'skyblock'],
  ['bounty_board', 'basics'],
  ['chapter_1_starting_out', 'skyblock'],
  ['chapter_2_the_cool_parts', 'skyblock'],
  ['chapter_2_the_atm_star', 'tech'],
  ['building_tips', 'basics'],
  ['tips_and_tricks', 'basics'],
  ['basic_armor', 'basics'],
  ['basic_logistics', 'basics'],
  ['basic_power', 'basics'],
  ['basic_tools', 'basics'],
  ['basic_storage', 'basics'],
  ['storage', 'basics'],
  ['getting_started', 'basics'],
  ['industrial_foregoing', 'tech'],
  ['railcraft', 'tech'],
  ['generators', 'tech'],
  ['extended__advanced_ae', 'tech'],
  ['extended_advanced_ae', 'tech'],
  ['applied_energistics_2', 'tech'],
  ['chapter_3_allthemodium', 'tech'],
  ['chapter_4_atm_star', 'tech'],
  ['chapter_4_the_atm_star', 'tech'],
  ['chapter_5_creative_items', 'tech'],
  ['create', 'tech'],
  ['extreme_reactors', 'tech'],
  ['immersive_engineering', 'tech'],
  ['integrated_dynamics', 'tech'],
  ['mekanism', 'tech'],
  ['mekanism_reactors', 'tech'],
  ['mi_digital', 'tech'],
  ['mi_electric', 'tech'],
  ['mi_endgame', 'tech'],
  ['mi_steam', 'tech'],
  ['digital_age', 'tech'],
  ['electric_age', 'tech'],
  ['the_electric_age', 'tech'],
  ['feeling_electric', 'tech'],
  ['steam_age', 'tech'],
  ['steam_age_new_beginnings', 'tech'],
  ['the_nuclear_age', 'tech'],
  ['the_end_game', 'tech'],
  ['implosion_power', 'tech'],
  ['age_of_oil_and_blastproof_plates', 'tech'],
  ['oritech', 'tech'],
  ['powah', 'tech'],
  ['pylons', 'tech'],
  ['apotheosis_gear', 'mods'],
  ['apotheosis_2', 'mods'],
  ['apothic_enchanting', 'mods'],
  ['apothic_spawners', 'mods'],
  ['ars_nouveau', 'mods'],
  ['baubley_heart_canisters', 'mods'],
  ['bbl_routers', 'mods'],
  ['draconic_evolution', 'mods'],
  ['elmystical_agriculturerr', 'mods'],
  ['food_and_farming', 'mods'],
  ['forbidden__arcanus', 'mods'],
  ['forbidden_and_arcanus', 'mods'],
  ['hostile_neural_networks', 'mods'],
  ['justdirethings', 'mods'],
  ['just_dire_things', 'mods'],
  ['mystical_agriculture', 'mods'],
  ['modular_router', 'mods'],
  ['modular_routers', 'mods'],
  ['occultism', 'mods'],
  ['pneumaticcraft', 'mods'],
  ['productive_bees', 'mods'],
  ['productive_farming', 'mods'],
  ['productive_trees', 'mods'],
  ['irons_spells_n_spellbooks', 'mods'],
  ['silent_gear', 'mods'],
  ['xycraft', 'mods'],
]);

const LOCALIZED_CHAPTER_FILE_SLUG_OVERRIDES = new Map([
  ['apotheosis_2', 'apothic_spawners'],
  ['chapter_4_atm_star', 'chapter_4_the_atm_star'],
  ['extended__advanced_ae', 'extended_advanced_ae'],
  ['forbidden__arcanus', 'forbidden_and_arcanus'],
  ['justdirethings', 'just_dire_things'],
  ['mi_digital', 'digital_age'],
  ['mi_electric', 'electric_age'],
  ['mi_endgame', 'the_end_game'],
  ['mi_steam', 'steam_age'],
  ['modular_router', 'modular_routers'],
  ['storage', 'basic_storage'],
]);

class Tokenizer {
  constructor(text, sourceName) {
    this.text = text;
    this.sourceName = sourceName;
    this.index = 0;
    this.cached = null;
  }

  peek() {
    if (!this.cached) {
      this.cached = this.readNext();
    }
    return this.cached;
  }

  next() {
    const token = this.peek();
    this.cached = null;
    return token;
  }

  readNext() {
    this.skipWhitespace();
    if (this.index >= this.text.length) {
      return null;
    }

    const char = this.text[this.index];

    if ('{}[]:,'.includes(char)) {
      this.index += 1;
      return { type: 'symbol', value: char };
    }

    if (char === '"') {
      return { type: 'string', value: this.readString() };
    }

    return { type: 'bare', value: this.readBare() };
  }

  skipWhitespace() {
    while (this.index < this.text.length && /\s/.test(this.text[this.index])) {
      this.index += 1;
    }
  }

  readString() {
    const start = this.index;
    this.index += 1;

    while (this.index < this.text.length) {
      const char = this.text[this.index];

      if (char === '\\') {
        this.index += 2;
        continue;
      }

      if (char === '"') {
        this.index += 1;
        const raw = this.text.slice(start, this.index);
        return JSON.parse(raw);
      }

      this.index += 1;
    }

    throw new Error(`未闭合的字符串: ${this.sourceName}`);
  }

  readBare() {
    const start = this.index;

    while (this.index < this.text.length) {
      const char = this.text[this.index];
      if (/\s/.test(char) || '{}[]:,'.includes(char)) {
        break;
      }
      this.index += 1;
    }

    return this.text.slice(start, this.index);
  }
}

function parseSnbt(text, sourceName) {
  const tokenizer = new Tokenizer(text, sourceName);
  const value = parseValue(tokenizer, sourceName);
  const leftover = tokenizer.peek();

  if (leftover) {
    throw new Error(`SNBT 解析后仍有剩余内容: ${sourceName}`);
  }

  return value;
}

function parseValue(tokenizer, sourceName) {
  const token = tokenizer.next();

  if (!token) {
    throw new Error(`意外结束: ${sourceName}`);
  }

  if (token.type === 'symbol') {
    if (token.value === '{') {
      return parseObject(tokenizer, sourceName);
    }
    if (token.value === '[') {
      return parseArray(tokenizer, sourceName);
    }
    throw new Error(`意外符号 ${token.value}: ${sourceName}`);
  }

  if (token.type === 'string') {
    return token.value;
  }

  return parsePrimitive(token.value);
}

function parseObject(tokenizer, sourceName) {
  const object = {};

  while (true) {
    const next = tokenizer.peek();

    if (!next) {
      throw new Error(`对象未闭合: ${sourceName}`);
    }

    if (next.type === 'symbol' && next.value === '}') {
      tokenizer.next();
      return object;
    }

    const keyToken = tokenizer.next();

    if (!keyToken || !['bare', 'string'].includes(keyToken.type)) {
      throw new Error(`非法对象键: ${sourceName}`);
    }

    const colon = tokenizer.next();
    if (!colon || colon.type !== 'symbol' || colon.value !== ':') {
      throw new Error(`对象键缺少冒号: ${sourceName}`);
    }

    object[String(keyToken.value)] = parseValue(tokenizer, sourceName);

    const separator = tokenizer.peek();
    if (separator && separator.type === 'symbol' && separator.value === ',') {
      tokenizer.next();
    }
  }
}

function parseArray(tokenizer, sourceName) {
  const array = [];

  while (true) {
    const next = tokenizer.peek();

    if (!next) {
      throw new Error(`数组未闭合: ${sourceName}`);
    }

    if (next.type === 'symbol' && next.value === ']') {
      tokenizer.next();
      return array;
    }

    array.push(parseValue(tokenizer, sourceName));

    const separator = tokenizer.peek();
    if (separator && separator.type === 'symbol' && separator.value === ',') {
      tokenizer.next();
    }
  }
}

function parsePrimitive(raw) {
  if (raw === 'true') {
    return true;
  }
  if (raw === 'false') {
    return false;
  }

  if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[bslfdBSLFD])?$/.test(raw)) {
    const suffix = raw.match(/[bslfdBSLFD]$/)?.[0]?.toLowerCase() || '';
    const numeric = raw.replace(/[bslfdBSLFD]$/, '');

    if (suffix === 'l' && /^[+-]?\d+$/.test(numeric)) {
      const longValue = BigInt(numeric);

      if (longValue > BigInt(Number.MAX_SAFE_INTEGER) || longValue < BigInt(Number.MIN_SAFE_INTEGER)) {
        return longValue.toString();
      }
    }

    return Number(numeric);
  }

  return raw;
}

function readSnbt(filePath) {
  return parseSnbt(fs.readFileSync(filePath, 'utf8'), path.relative(rootDir, filePath));
}

function readOptionalSnbt(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return readSnbt(filePath);
}

function listSnbtFiles(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((fileName) => fileName.endsWith('.snbt'))
    .sort((left, right) => left.localeCompare(right));
}

function listOptionalSnbtFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return listSnbtFiles(dirPath);
}

function slugifyChapterLabel(value) {
  return String(value)
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/\\+/g, ' ')
    .replace(/[:/\-]/g, ' ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function resolveChapterFileKey(rawValue, fileName) {
  const fallbackKey = fileName.replace(/\.snbt$/, '');
  const candidate = String(rawValue || fallbackKey);

  if (candidate === `f${fallbackKey}`) {
    return fallbackKey;
  }

  return candidate;
}

function ensureChapterCoverage(sourceFiles, translatedFiles, compareFiles) {
  const translatedSet = new Set(translatedFiles);
  const compareSet = new Set(compareFiles);
  const missingTranslated = sourceFiles.filter((fileName) => !translatedSet.has(fileName));
  const missingCompare = sourceFiles.filter((fileName) => !compareSet.has(fileName));

  if (missingTranslated.length || missingCompare.length) {
    const messages = [];

    if (missingTranslated.length) {
      messages.push(`中文汉化缺失: ${missingTranslated.join(', ')}`);
    }

    if (missingCompare.length) {
      messages.push(`中英对照缺失: ${missingCompare.join(', ')}`);
    }

    throw new Error(messages.join('；'));
  }
}

function ensureSourceChapterParity(sourceFiles, compareSourceFiles) {
  const sourceSet = new Set(sourceFiles);
  const extraCompareSource = compareSourceFiles.filter((fileName) => !sourceSet.has(fileName));

  if (extraCompareSource.length) {
    const messages = [];

    if (extraCompareSource.length) {
      messages.push(`中英对照结构章节多出: ${extraCompareSource.join(', ')}`);
    }

    throw new Error(messages.join('；'));
  }
}

function ensureLocalizedChapterFileParity(translatedFiles, compareFiles) {
  const translatedSet = new Set(translatedFiles);
  const compareSet = new Set(compareFiles);
  const missingCompare = translatedFiles.filter((fileName) => !compareSet.has(fileName));
  const extraCompare = compareFiles.filter((fileName) => !translatedSet.has(fileName));

  if (missingCompare.length || extraCompare.length) {
    const messages = [];

    if (missingCompare.length) {
      messages.push(`中英对照章节语言文件缺失: ${missingCompare.join(', ')}`);
    }

    if (extraCompare.length) {
      messages.push(`中英对照章节语言文件多出: ${extraCompare.join(', ')}`);
    }

    throw new Error(messages.join('；'));
  }
}

function ensureChapterLocalization(chapterId, fileName, chapterTitle, compareChapterTitle) {
  const messages = [];

  if (!chapterTitle) {
    messages.push('缺少中文章节标题');
  }

  if (!compareChapterTitle?.primary) {
    messages.push('缺少中英对照章节标题');
  }

  if (!compareChapterTitle?.secondary) {
    messages.push('缺少英文章节标题');
  }

  if (messages.length) {
    throw new Error(`${fileName} (${chapterId}) ${messages.join('；')}`);
  }
}

function stripFormatting(value) {
  return String(value)
    .replace(/&[0-9A-FK-OR]/gi, '')
    .replace(/§[0-9A-FK-OR]/gi, '')
    .replace(/\{image:([^}]+)\}/g, (_, content) => {
      const imagePath = content.trim().split(/\s+/)[0] || '图片';
      return `[图片: ${imagePath}]`;
    });
}

function normalizeParagraphs(text) {
  return stripFormatting(text)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function toDisplayText(value) {
  if (value == null) {
    return '';
  }

  if (Array.isArray(value)) {
    return normalizeParagraphs(
      value
        .map((entry) => toDisplayText(entry))
        .filter(Boolean)
        .join('\n\n'),
    );
  }

  if (typeof value === 'object') {
    return normalizeParagraphs(JSON.stringify(value, null, 2));
  }

  return normalizeParagraphs(String(value));
}

function buildLangIndex(entries, prefix, suffix) {
  const result = new Map();

  for (const [key, value] of Object.entries(entries)) {
    const match = new RegExp(`^${prefix}\\.([A-F0-9]+)\\.${suffix}$`).exec(key);
    if (match) {
      result.set(match[1], toDisplayText(value));
    }
  }

  return result;
}

function cleanEnglishText(text) {
  return text
    .replace(/\b[klmnorz](?=[A-Z])/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function splitLocalizedText(value) {
  const text = toDisplayText(value);

  if (!text) {
    return { primary: '', secondary: '' };
  }

  const match = /^(.*)\[([\s\S]+)\]\s*$/s.exec(text);
  if (!match) {
    return { primary: text, secondary: '' };
  }

  return {
    primary: normalizeParagraphs(match[1]),
    secondary: cleanEnglishText(normalizeParagraphs(match[2])),
  };
}

function buildLocalizedIndex(entries, prefix, suffix) {
  const result = new Map();

  for (const [key, value] of Object.entries(entries)) {
    const match = new RegExp(`^${prefix}\\.([A-F0-9]+)\\.${suffix}$`).exec(key);
    if (match) {
      result.set(match[1], splitLocalizedText(value));
    }
  }

  return result;
}

function mergeMaps(primary, fallback) {
  return new Map([...(fallback?.entries?.() || []), ...(primary?.entries?.() || [])]);
}

function normalizeHexId(value) {
  if (value == null || value === '') {
    return '';
  }

  const raw = String(value).replace(/L$/i, '').trim();

  if (/^[+-]?\d+$/.test(raw)) {
    return BigInt(raw).toString(16).toUpperCase().padStart(16, '0');
  }

  if (/^[A-F0-9]+$/i.test(raw)) {
    return raw.toUpperCase().padStart(16, '0');
  }

  return raw.toUpperCase();
}

function summarizeQuestReward(rawReward, rewardTableTitles) {
  const rewardType = String(rawReward?.type || 'unknown');

  if (rewardType === 'item' && rawReward?.item?.id) {
    const itemCount = Number(rawReward?.item?.count || rawReward?.count || 1);
    return {
      id: String(rawReward.id || ''),
      type: rewardType,
      label: `${itemCount}x ${rawReward.item.id}`,
    };
  }

  if (rewardType === 'xp') {
    return {
      id: String(rawReward.id || ''),
      type: rewardType,
      label: `${Number(rawReward?.xp || 0)} 经验值`,
    };
  }

  if (rewardType === 'xp_levels') {
    return {
      id: String(rawReward.id || ''),
      type: rewardType,
      label: `${Number(rawReward?.levels || 0)} 级经验`,
    };
  }

  if (rewardType === 'random' || rewardType === 'loot') {
    const tableId = normalizeHexId(rawReward?.table_id);
    const tableTitle = rewardTableTitles.get(tableId);

    return {
      id: String(rawReward.id || ''),
      type: rewardType,
      label: tableTitle || `${rewardType === 'random' ? '随机奖励' : '奖励池'} ${tableId}`,
    };
  }

  return {
    id: String(rawReward?.id || ''),
    type: rewardType,
    label: rewardType,
  };
}

function collectPrimitiveText(value, bucket) {
  if (value == null) {
    return;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const text = stripFormatting(String(value)).trim();
    if (text) {
      bucket.push(text);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectPrimitiveText(entry, bucket);
    }
    return;
  }

  for (const [key, entry] of Object.entries(value)) {
    if (!['id', 'x', 'y', 'size', 'min_width', 'icon_scale'].includes(key)) {
      bucket.push(key);
    }
    collectPrimitiveText(entry, bucket);
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function resolveTopLevelGroup(chapterFileName) {
  const groupId = TOP_LEVEL_GROUP_BY_FILE.get(chapterFileName) || 'ungrouped';
  return TOP_LEVEL_GROUPS.find((group) => group.id === groupId) || TOP_LEVEL_GROUPS[TOP_LEVEL_GROUPS.length - 1];
}

function buildLocalizedChapterEntries(chapterTitles, chapterSubtitles, compareChapterTitles, compareChapterSubtitles) {
  const chapterIds = unique([...chapterTitles.keys(), ...compareChapterTitles.keys()]).sort((left, right) => left.localeCompare(right));

  return chapterIds.map((chapterId) => {
    const compareChapterTitle = compareChapterTitles.get(chapterId);
    const compareChapterSubtitle = compareChapterSubtitles.get(chapterId);

    return {
      id: chapterId,
      title: chapterTitles.get(chapterId) || '',
      subtitle: chapterSubtitles.get(chapterId) || compareChapterSubtitle?.primary || '',
      englishTitle: compareChapterTitle?.secondary || '',
      englishSubtitle: compareChapterSubtitle?.secondary || '',
      slug: slugifyChapterLabel(compareChapterTitle?.secondary || chapterTitles.get(chapterId) || chapterId),
    };
  });
}

function buildLocalizedChapterFileMap(localizedEntries, localizedChapterFiles, sourceChapterMap) {
  const fileNameById = new Map();
  const pendingIdsBySlug = new Map();

  for (const [chapterId, sourceChapter] of sourceChapterMap.entries()) {
    fileNameById.set(chapterId, sourceChapter.chapterFileKey);
  }

  for (const entry of localizedEntries) {
    if (fileNameById.has(entry.id)) {
      continue;
    }

    const bucket = pendingIdsBySlug.get(entry.slug) || [];
    bucket.push(entry.id);
    pendingIdsBySlug.set(entry.slug, bucket);
  }

  const unresolvedFiles = [];

  for (const fileName of localizedChapterFiles) {
    const fileKey = fileName.replace(/\.snbt$/, '');

    if ([...sourceChapterMap.values()].some((sourceChapter) => sourceChapter.chapterFileKey === fileKey)) {
      continue;
    }

    const lookupKey = LOCALIZED_CHAPTER_FILE_SLUG_OVERRIDES.get(fileKey) || fileKey;
    const bucket = pendingIdsBySlug.get(lookupKey) || [];
    const chapterId = bucket.shift();

    if (!chapterId) {
      unresolvedFiles.push(fileName);
      continue;
    }

    fileNameById.set(chapterId, fileKey);
  }

  if (unresolvedFiles.length) {
    throw new Error(`以下章节语言文件无法匹配章节标题: ${unresolvedFiles.join(', ')}`);
  }

  return fileNameById;
}

function buildDataset() {
  const fileLang = readOptionalSnbt(PACK_FILE);
  const chapterLang = readOptionalSnbt(CHAPTER_LANG_FILE);
  const groupLang = readOptionalSnbt(CHAPTER_GROUP_LANG_FILE);
  const rewardTableLang = readOptionalSnbt(REWARD_TABLE_LANG_FILE);
  const mergedLang = readOptionalSnbt(mergedLangFile);
  const compareFileLang = readOptionalSnbt(COMPARE_PACK_FILE);
  const compareChapterLang = readOptionalSnbt(COMPARE_CHAPTER_LANG_FILE);
  const compareGroupLang = readOptionalSnbt(COMPARE_CHAPTER_GROUP_LANG_FILE);
  const compareRewardTableLang = readOptionalSnbt(COMPARE_REWARD_TABLE_LANG_FILE);
  const compareMergedLang = readOptionalSnbt(compareMergedLangFile);

  const packTitle = toDisplayText(fileLang['file.0000000000000001.title'] || mergedLang['file.0000000000000001.title'] || 'ATM10 任务查询');
  const chapterTitles = mergeMaps(
    buildLangIndex(chapterLang, 'chapter', 'title'),
    buildLangIndex(mergedLang, 'chapter', 'title'),
  );
  const chapterSubtitles = mergeMaps(
    buildLangIndex(chapterLang, 'chapter', 'chapter_subtitle'),
    buildLangIndex(mergedLang, 'chapter', 'chapter_subtitle'),
  );
  const groupTitles = mergeMaps(
    buildLangIndex(groupLang, 'chapter_group', 'title'),
    buildLangIndex(mergedLang, 'chapter_group', 'title'),
  );
  const rewardTableTitles = mergeMaps(
    buildLangIndex(rewardTableLang, 'reward_table', 'title'),
    buildLangIndex(mergedLang, 'reward_table', 'title'),
  );
  const comparePackTitle = splitLocalizedText(compareFileLang['file.0000000000000001.title'] || compareMergedLang['file.0000000000000001.title'] || packTitle);
  const compareChapterTitles = mergeMaps(
    buildLocalizedIndex(compareChapterLang, 'chapter', 'title'),
    buildLocalizedIndex(compareMergedLang, 'chapter', 'title'),
  );
  const compareChapterSubtitles = mergeMaps(
    buildLocalizedIndex(compareChapterLang, 'chapter', 'chapter_subtitle'),
    buildLocalizedIndex(compareMergedLang, 'chapter', 'chapter_subtitle'),
  );
  const compareGroupTitles = mergeMaps(
    buildLocalizedIndex(compareGroupLang, 'chapter_group', 'title'),
    buildLocalizedIndex(compareMergedLang, 'chapter_group', 'title'),
  );
  const compareRewardTableTitles = mergeMaps(
    buildLocalizedIndex(compareRewardTableLang, 'reward_table', 'title'),
    buildLocalizedIndex(compareMergedLang, 'reward_table', 'title'),
  );
  const mergedRewardTableTitles = mergeMaps(rewardTableTitles, new Map(
    [...compareRewardTableTitles.entries()].map(([id, value]) => [id, value.primary || value.secondary || '']),
  ));
  const mergedQuestTitles = buildLangIndex(mergedLang, 'quest', 'title');
  const mergedQuestSubtitles = buildLangIndex(mergedLang, 'quest', 'quest_subtitle');
  const mergedQuestDescriptions = buildLangIndex(mergedLang, 'quest', 'quest_desc');
  const mergedTaskTitles = buildLangIndex(mergedLang, 'task', 'title');
  const mergedCompareQuestTitles = buildLocalizedIndex(compareMergedLang, 'quest', 'title');
  const mergedCompareQuestSubtitles = buildLocalizedIndex(compareMergedLang, 'quest', 'quest_subtitle');
  const mergedCompareQuestDescriptions = buildLocalizedIndex(compareMergedLang, 'quest', 'quest_desc');

  const chapterFiles = listSnbtFiles(chaptersRoot);
  const compareSourceChapterFiles = listOptionalSnbtFiles(compareChaptersRoot);
  const translatedChapterFiles = listSnbtFiles(langChaptersRoot);
  const compareChapterFiles = listSnbtFiles(compareLangChaptersRoot);

  ensureSourceChapterParity(chapterFiles, compareSourceChapterFiles);
  ensureChapterCoverage(chapterFiles, translatedChapterFiles, compareChapterFiles);
  ensureLocalizedChapterFileParity(translatedChapterFiles, compareChapterFiles);

  const sourceChapters = chapterFiles.map((fileName) => {
    const rawChapter = readSnbt(path.join(chaptersRoot, fileName));
    const chapterFileKey = resolveChapterFileKey(rawChapter.filename, fileName);

    return {
      fileName,
      chapterFileKey,
      rawChapter,
    };
  });

  const sourceChapterMap = new Map(
    sourceChapters.map((entry) => [String(entry.rawChapter.id || ''), entry]),
  );
  const localizedChapterEntries = buildLocalizedChapterEntries(
    chapterTitles,
    chapterSubtitles,
    compareChapterTitles,
    compareChapterSubtitles,
  );
  const localizedChapterFileMap = buildLocalizedChapterFileMap(
    localizedChapterEntries,
    translatedChapterFiles,
    sourceChapterMap,
  );

  const quests = [];
  const chapters = [];
  const questById = new Map();

  for (const entry of localizedChapterEntries) {
    const sourceChapter = sourceChapterMap.get(entry.id);
    const chapterFileKey = localizedChapterFileMap.get(entry.id) || entry.slug || `chapter_${entry.id.toLowerCase()}`;
    const fileName = `${chapterFileKey}.snbt`;
    const rawChapter = sourceChapter?.rawChapter || null;
    const langPath = path.join(langChaptersRoot, fileName);
    const compareLangPath = path.join(compareLangChaptersRoot, fileName);
    const langChapter = fs.existsSync(langPath) ? readSnbt(langPath) : {};
    const compareLangChapter = readOptionalSnbt(compareLangPath);

    const questTitles = mergeMaps(buildLangIndex(langChapter, 'quest', 'title'), mergedQuestTitles);
    const questSubtitles = mergeMaps(buildLangIndex(langChapter, 'quest', 'quest_subtitle'), mergedQuestSubtitles);
    const questDescriptions = mergeMaps(buildLangIndex(langChapter, 'quest', 'quest_desc'), mergedQuestDescriptions);
    const taskTitles = mergeMaps(buildLangIndex(langChapter, 'task', 'title'), mergedTaskTitles);
    const compareQuestTitles = mergeMaps(buildLocalizedIndex(compareLangChapter, 'quest', 'title'), mergedCompareQuestTitles);
    const compareQuestSubtitles = mergeMaps(buildLocalizedIndex(compareLangChapter, 'quest', 'quest_subtitle'), mergedCompareQuestSubtitles);
    const compareQuestDescriptions = mergeMaps(buildLocalizedIndex(compareLangChapter, 'quest', 'quest_desc'), mergedCompareQuestDescriptions);

    const chapterId = entry.id;
    const compareChapterTitle = compareChapterTitles.get(chapterId);
    const compareChapterSubtitle = compareChapterSubtitles.get(chapterId);
    const topLevelGroup = resolveTopLevelGroup(chapterFileKey);
    const localizedChapterTitle = entry.title;
    ensureChapterLocalization(chapterId, fileName, localizedChapterTitle, compareChapterTitle);
    const chapterTitle = localizedChapterTitle;
    const chapterSubtitle = entry.subtitle;
    const chapterQuests = Array.isArray(rawChapter?.quests) ? rawChapter.quests : [];

    const chapterRecord = {
      id: chapterId,
      filename: chapterFileKey,
      fileName,
      title: chapterTitle,
      englishTitle: compareChapterTitle?.secondary || '',
      subtitle: chapterSubtitle,
      englishSubtitle: compareChapterSubtitle?.secondary || '',
      groupId: topLevelGroup.id,
      groupTitle: topLevelGroup.title,
      groupEnglishTitle: topLevelGroup.englishTitle,
      orderIndex: Number(rawChapter?.order_index || 1000),
      questCount: chapterQuests.length,
      hiddenQuestCount: 0,
      optionalQuestCount: 0,
    };

    chapters.push(chapterRecord);

    if (!rawChapter) {
      continue;
    }

    for (const rawQuest of chapterQuests) {
      const questId = String(rawQuest.id || '');
      const rawTasks = Array.isArray(rawQuest.tasks) ? rawQuest.tasks : [];
      const rawRewards = Array.isArray(rawQuest.rewards) ? rawQuest.rewards : [];
      const primitiveTaskText = [];
      const compareQuestTitle = compareQuestTitles.get(questId);
      const compareQuestSubtitle = compareQuestSubtitles.get(questId);
      const compareQuestDescription = compareQuestDescriptions.get(questId);
      const rewards = rawRewards.map((reward) => summarizeQuestReward(reward, mergedRewardTableTitles));

      for (const task of rawTasks) {
        collectPrimitiveText(task, primitiveTaskText);
      }

      const quest = {
        id: questId,
        title: questTitles.get(questId) || compareQuestTitle?.primary || `未命名任务 ${questId}`,
        englishTitle: compareQuestTitle?.secondary || '',
        subtitle: questSubtitles.get(questId) || compareQuestSubtitle?.primary || '',
        englishSubtitle: compareQuestSubtitle?.secondary || '',
        description: questDescriptions.get(questId) || compareQuestDescription?.primary || '',
        englishDescription: compareQuestDescription?.secondary || '',
        chapterId,
        chapterTitle,
        chapterEnglishTitle: chapterRecord.englishTitle,
        chapterSubtitle,
        chapterEnglishSubtitle: chapterRecord.englishSubtitle,
        chapterFile: chapterRecord.filename,
        groupId: chapterRecord.groupId,
        groupTitle: chapterRecord.groupTitle,
        groupEnglishTitle: chapterRecord.groupEnglishTitle,
        optional: Boolean(rawQuest.optional),
        hidden: Boolean(rawQuest.invisible),
        dependencies: unique((rawQuest.dependencies || []).map(String)),
        taskIds: rawTasks.map((task) => String(task.id || '')),
        taskTitles: rawTasks.map((task, index) => taskTitles.get(String(task.id || '')) || `任务 ${index + 1}`),
        taskTypes: unique(rawTasks.map((task) => String(task.type || '未知'))),
        taskCount: rawTasks.length,
        rewards,
        sourceFile: `support/config/ftbquests/quests/chapters/${fileName}`,
        sourceLangFile: fs.existsSync(langPath)
          ? `support/config/ftbquests/quests/lang/zh_cn/chapters/${fileName}`
          : '',
        searchText: '',
      };

      quest.searchText = unique([
        quest.title,
        quest.subtitle,
        quest.description,
        quest.chapterTitle,
        quest.chapterSubtitle,
        quest.groupTitle,
        quest.chapterFile,
        ...quest.rewards.map((reward) => reward.label),
        ...quest.taskTitles,
        ...quest.taskTypes,
        ...primitiveTaskText,
      ]).join('\n');

      if (quest.hidden) {
        chapterRecord.hiddenQuestCount += 1;
      }
      if (quest.optional) {
        chapterRecord.optionalQuestCount += 1;
      }

      quests.push(quest);
      questById.set(questId, quest);
    }
  }

  for (const quest of quests) {
    quest.dependencyTitles = quest.dependencies.map((dependencyId) => {
      const dependencyQuest = questById.get(dependencyId);
      return dependencyQuest ? dependencyQuest.title : dependencyId;
    });
  }

  chapters.sort((left, right) => {
    if (left.orderIndex !== right.orderIndex) {
      return left.orderIndex - right.orderIndex;
    }
    return left.title.localeCompare(right.title, 'zh-Hans-CN');
  });

  if (chapters.length !== localizedChapterEntries.length) {
    throw new Error(`章节生成数量异常: 本地化章节 ${localizedChapterEntries.length} 个，生成章节 ${chapters.length} 个`);
  }

  const groups = chapters.reduce((bucket, chapter) => {
    let group = bucket.find((entry) => entry.id === chapter.groupId);
    if (!group) {
      group = {
        id: chapter.groupId,
        title: chapter.groupTitle,
        englishTitle: chapter.groupEnglishTitle,
        chapterCount: 0,
        questCount: 0,
      };
      bucket.push(group);
     }
     group.chapterCount += 1;
     group.questCount += chapter.questCount;
      return bucket;
    }, [])
    .sort((left, right) => {
      const leftOrder = TOP_LEVEL_GROUPS.find((group) => group.id === left.id)?.order ?? TOP_LEVEL_GROUPS.length;
      const rightOrder = TOP_LEVEL_GROUPS.find((group) => group.id === right.id)?.order ?? TOP_LEVEL_GROUPS.length;
      return leftOrder - rightOrder;
    });

  return {
    meta: {
      title: packTitle,
      englishTitle: comparePackTitle.secondary,
      generatedAt: new Date().toISOString(),
      chapterCount: chapters.length,
      questCount: quests.length,
      groupCount: groups.length,
      hiddenQuestCount: quests.filter((quest) => quest.hidden).length,
      optionalQuestCount: quests.filter((quest) => quest.optional).length,
    },
    groups,
    chapters,
    quests,
  };
}

function writeOutput(dataset) {
  fs.mkdirSync(outputDir, { recursive: true });

  const jsonOutput = JSON.stringify(dataset, null, 2);
  const jsOutput = `window.QUEST_DATA = ${jsonOutput};\n`;

  fs.writeFileSync(path.join(outputDir, 'quests.json'), jsonOutput, 'utf8');
  fs.writeFileSync(path.join(outputDir, 'data.js'), jsOutput, 'utf8');
}

const dataset = buildDataset();
writeOutput(dataset);

console.log(
  `已生成任务网页数据: ${dataset.meta.chapterCount} 个章节, ${dataset.meta.questCount} 个任务 -> ${path.relative(
    rootDir,
    outputDir,
  )}`,
);
