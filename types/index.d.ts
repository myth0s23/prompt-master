export type Draft = { text: string; isSent: boolean }

declare module 'claude-code' {
  interface PluginState {
    'prompt-master': {
      isBusy: boolean
      original: string | null
      drafts: Shaped<Draft[]>
    }
  }
}
