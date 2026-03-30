export default defineEventHandler(async () => {
  const storage = useStorage('/assets')

  try {
    const fileContent = await storage.getItemRaw('quest-browser/quests.json')

    if (!fileContent) {
      throw new Error('missing quest-browser/quests.json server asset')
    }

    const jsonText = typeof fileContent === 'string'
      ? fileContent
      : new TextDecoder().decode(fileContent)

    return JSON.parse(jsonText)
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: '无法读取任务数据，请确认 quests.json 已生成并打包到服务端资源中',
    })
  }
})
