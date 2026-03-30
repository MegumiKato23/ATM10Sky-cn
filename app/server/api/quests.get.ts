import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'support', 'quest-browser', 'quests.json')

  try {
    const fileContent = await readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: '无法读取任务数据，请先生成 support/quest-browser/quests.json',
    })
  }
})
