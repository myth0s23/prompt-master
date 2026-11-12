# Prompt Master

A Claude Code mod that rewrites a rough prompt into a sharper one before you send it. It keeps your intent and every concrete detail, adds nothing you did not say, leads with the goal, then context, constraints and what a good answer looks like, and asks Claude to state its assumptions where something essential is missing.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install prompt-master --marketplace myth0s23/prompt-master
```

Answer `y` to add the marketplace, then pick a scope (user scope loads it in every session).

From a shell:

```bash
claude plugin install prompt-master --marketplace myth0s23/prompt-master
```

In the Claude Code desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `myth0s23/prompt-master`, then **Add plugin**.

## Use

- **Terminal:** type a rough prompt, press **✦ Prompt Master** in the band above the prompt box (or focus the band with ctrl+x tab and press `p`). The rewrite replaces your draft for you to review; **Undo** (`u`) restores the original until you send.
- **Anywhere, including apps that draw their own prompt box:** `/pm <rough prompt>` shows the rewrite with **Send rewrite** and **Send original** buttons.

## Notes

- Rewrites use Sonnet at medium effort for speed. Change `MODEL` at the top of `hooks/register.tsx` to `'opus'` for a slower, sharper pass.
- The rewriter sees only the draft, not the conversation, so drafts that lean on earlier context ("do the same for the other file") are rewritten without it.
