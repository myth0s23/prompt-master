import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'prompt-master',
  component: 'AbovePrompt',
  requestId: 'band',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 9 },
    view: {},
  },
} as const

const answered = (text: string) => ({ value: {
  isAnswered: true as const,
  text,
  usage: {
    input_tokens: 1,
    output_tokens: 1,
    cache_read_input_tokens: 0,
    cache_creation_input_tokens: 0,
  },
} })

test('the band button rewrites the draft in place, and Undo restores it', async ($, on) => {
  let box = 'fix login bug pls'
  let asked = ''
  on('model.complete', (_, e) => {
    asked = typeof e.prompt === 'string' ? e.prompt : ''
    return answered('Fix the login bug. State the cause before changing code.')
  })
  on('prompt.read', () => ({ value: { text: box, cursor: box.length } }))
  on('prompt.fill', (_, e) => {
    box = e.text
    return { isFilled: true }
  })

  for (const surface of ['terminal', 'desktop'] as const) {
    box = 'fix login bug pls'
    const ui = await $.ui.mount({ ...BAND, surface })

    expect(await ui.find({ key: 'undo' })).toBeUndefined()
    await ui.press({ key: 'master' })
    expect(asked).toContain('<rough_prompt>\nfix login bug pls\n</rough_prompt>')
    expect(box).toBe('Fix the login bug. State the cause before changing code.')

    await ui.press({ key: 'undo' })
    expect(box).toBe('fix login bug pls')
    await ui.unmount()
  }
})

test('/pm in an app with its own composer shows the rewrite with a Send button', async ($, on) => {
  const sent: string[] = []
  on('command.register', () => ({ value: { command: 'pm' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('model.complete', () => answered('Summarise the README in five bullets.'))
  on('prompt.fill', () => ({ isFilled: false, refusal: 'no_composer' as const }))
  on('prompt.submit', (_, e) => {
    sent.push(e.text)
    return { text: e.text }
  })

  await $.session.start({ cwd: '/', surface: 'mobile', isInteractive: true })
  const out = await $.command.run({ command: 'pm', args: 'sum up readme', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })
  expect(out.text).toContain('Summarise the README in five bullets.')

  const ui = await $.ui.mount({
    plugin: 'prompt-master',
    surface: 'mobile',
    component: 'CommandOutput',
    requestId: 'm1',
    props: { command: 'pm', args: 'sum up readme', text: out.text ?? '', isErrored: false },
  })
  await ui.press({ key: 'send' })
  expect(sent).toEqual(['Summarise the README in five bullets.'])
  expect((await ui.find({ type: 'Text', text: /Sent/ }))?.text).toBe('Sent.')
  await ui.unmount()
})
