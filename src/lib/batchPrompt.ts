export interface BatchPromptSection {
  title: string
  prompt: string
}

const SECTION_LINE_RE = /^([^:：\n]{1,24})[:：]\s*(.*)$/

function normalizeLines(input: string) {
  return input
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
}

export function parseBatchPromptSections(input: string): BatchPromptSection[] {
  const sharedLines: string[] = []
  const sections: Array<{ title: string; lines: string[] }> = []
  let current: { title: string; lines: string[] } | null = null

  for (const line of normalizeLines(input)) {
    if (!line) continue

    const match = line.match(SECTION_LINE_RE)
    if (match) {
      current = {
        title: match[1].trim(),
        lines: [match[2].trim()].filter(Boolean),
      }
      sections.push(current)
      continue
    }

    if (current) {
      current.lines.push(line)
    } else {
      sharedLines.push(line)
    }
  }

  const sharedPrompt = sharedLines.join('\n').trim()

  return sections
    .map((section) => {
      const sectionPrompt = `${section.title}：${section.lines.join('\n').trim()}`.trim()
      return {
        title: section.title,
        prompt: [sharedPrompt, sectionPrompt].filter(Boolean).join('\n\n'),
      }
    })
    .filter((section) => section.title && section.prompt)
}
