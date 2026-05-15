import { describe, expect, it } from 'vitest'
import { parseBatchPromptSections } from './batchPrompt'

describe('parseBatchPromptSections', () => {
  it('splits colon-prefixed image sections into ordered batch prompts', () => {
    const sections = parseBatchPromptSections(`
主图：高级感电商主视觉，产品放在画面中心
背景图：浅灰摄影棚背景，柔和空间阴影
尺寸图：白底技术说明风格，标注长宽高
`)

    expect(sections).toEqual([
      { title: '主图', prompt: '主图：高级感电商主视觉，产品放在画面中心' },
      { title: '背景图', prompt: '背景图：浅灰摄影棚背景，柔和空间阴影' },
      { title: '尺寸图', prompt: '尺寸图：白底技术说明风格，标注长宽高' },
    ])
  })

  it('applies leading shared context to every batch prompt and preserves multiline details', () => {
    const sections = parseBatchPromptSections(`
产品是白色智能音箱，整体风格要统一。

主图：高级感电商主视觉
产品居中，柔和布光。

人物图：年轻女性在客厅使用产品
自然生活方式摄影。
`)

    expect(sections).toEqual([
      {
        title: '主图',
        prompt: '产品是白色智能音箱，整体风格要统一。\n\n主图：高级感电商主视觉\n产品居中，柔和布光。',
      },
      {
        title: '人物图',
        prompt: '产品是白色智能音箱，整体风格要统一。\n\n人物图：年轻女性在客厅使用产品\n自然生活方式摄影。',
      },
    ])
  })
})
