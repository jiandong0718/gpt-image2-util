import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_PARAMS } from './types'
import { DEFAULT_SETTINGS } from './lib/apiProfiles'

const mocks = vi.hoisted(() => ({
  putTask: vi.fn(() => Promise.resolve('task-key')),
  callImageApi: vi.fn(() => new Promise(() => {})),
}))

vi.mock('./lib/db', () => ({
  getAllTasks: vi.fn(() => Promise.resolve([])),
  putTask: mocks.putTask,
  deleteTask: vi.fn(() => Promise.resolve(undefined)),
  clearTasks: vi.fn(() => Promise.resolve(undefined)),
  getImage: vi.fn(() => Promise.resolve(undefined)),
  getAllImages: vi.fn(() => Promise.resolve([])),
  putImage: vi.fn(() => Promise.resolve('image-key')),
  deleteImage: vi.fn(() => Promise.resolve(undefined)),
  clearImages: vi.fn(() => Promise.resolve(undefined)),
  storeImage: vi.fn(() => Promise.resolve('image-id')),
}))

vi.mock('./lib/api', () => ({
  callImageApi: mocks.callImageApi,
}))

import { submitTask, useStore } from './store'

describe('batch generation submissions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    useStore.setState({
      settings: { ...DEFAULT_SETTINGS, apiKey: 'test-key' },
      generationMode: 'batch',
      prompt: '主图：高级感电商主视觉\n背景图：浅灰摄影棚背景',
      inputImages: [],
      maskDraft: null,
      params: { ...DEFAULT_PARAMS, n: 1 },
      tasks: [],
      showSettings: false,
      toast: null,
      confirmDialog: null,
      showToast: vi.fn(),
      setConfirmDialog: vi.fn(),
    } as any)
  })

  it('creates one task per batch prompt section while preserving current params', async () => {
    await submitTask()

    const tasks = useStore.getState().tasks
    expect(tasks).toHaveLength(2)
    expect(tasks.map((task) => task.prompt)).toEqual([
      '背景图：浅灰摄影棚背景',
      '主图：高级感电商主视觉',
    ])
    expect(tasks.every((task) => task.params.n === 1)).toBe(true)
    expect(mocks.putTask).toHaveBeenCalledTimes(2)
  })

  it('rejects batch mode input with fewer than two sections', async () => {
    useStore.setState({ prompt: '主图：只有一张图' })

    await submitTask()

    expect(useStore.getState().tasks).toHaveLength(0)
    expect(useStore.getState().showToast).toHaveBeenCalledWith(
      expect.stringContaining('至少 2 个'),
      'error',
    )
  })
})
