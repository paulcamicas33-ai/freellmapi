# Noisette — the recurring mascot

Read this before writing any story. Noisette appears in every film made with this skill, so the
user's audience recognises her from one video to the next. Keep her identical everywhere.

## Who she is
- **Name:** Noisette. **Species:** a little hedgehog girl (« une petite hérissonne »), about 5.
- **Personality:** curious, kind, a little clumsy, never gives up. She is brave because she is
  scared and tries anyway. She never mocks anyone, never wins by being mean or by magic alone.
- **Signature object:** her glowing lantern. She carries it on walks, at dusk and at night; it
  lights faces near her and is a natural motif (it can guide a lost friend, show a hidden path).
- **Signature line:** at the turning point she offers help with a **specific** sentence that says
  what they will do: « On va essayer de la *guérir* ! », « On va le *chercher* ensemble ! », « On va
  te ramener à la *mer* ! ». Never the vague « On essaie ensemble ? » (the user found it
  meaningless: « on essaie quoi ? »). The recurring idea is « ensemble », always with a verb.
- **Signature gesture:** a wave with her left hand, lantern in the right.
- **Voice in captions:** short, warm sentences; she speaks in the first person in dialogue lines
  (`"speaker": "Noisette"`), the narrator speaks in the third person.

## Her design (never change it)
`src/cast/mascot.ts` holds the values; import `NOISETTE` and use them as they are.

| part | value |
|---|---|
| species in the rig | `hedgehog` (soft rounded spikes on head and back, small round ears, cream face mask) |
| fur | `#c98a5a` (hazelnut); spikes are `shade(fur, -0.35)` |
| face and belly | `#fbe8cf` |
| scarf (accent) | `#4fb36c` (leaf green) |
| eyes | `#3b2416`, big, two highlights |
| blush | `#f39a9e` |
| lantern | `Lantern` in `src/world/Props.tsx`, held in her right hand via `handPosition(hero, "R")` |
| size | the same scale as the other children-sized characters of the story (default 1) |

The caption accent colour for her lines is her scarf green, `#3f9a5c`.

## How she enters stories
- **Default:** she is the hero, or the helper who meets the hero (« Noisette rencontre... »).
- **If the user brings their own hero:** Noisette is still there, as the friend who helps at the
  turning point (and says her line). Ask in the brief only if the user seems to want her out.
- **Opening:** when the story is a series episode, open on her wave and « Bonjour ! » (the
  template's intro scene in this skill's test project shows the timing: walk in, stop, wave, line).
- **Ending:** she ends close to the camera, eyes closed in a happy smile (`blink: 1, smile: 1`)
  or waving goodbye; the lantern glows in the last image.

## Model sheet
`src/MascotSheet.tsx` renders her model sheet (main pose with the lantern + six expressions:
joie, surprise, tristesse, curiosité, fou rire, fierté). Render it once per project
(`npx --no-install remotion still src/index.ts 'MascotSheet' '.renders/stills/MascotSheet-f0.png' --frame=0`)
and compare: if she looks different from the sheet, fix the scene, not her.

## Never
Change her colours, species or name; give her another catchphrase; make her mean, scared to the
point of crying alone at the end, or the butt of a joke; put real brand items on her.

## Pistache — Noisette's best friend (from season 2)
- A shy, greedy, very curious little mouse (species `mouse` in the rig): lavender-grey fur, big
  pink ears, a curly pink tail, an **orange scarf** (`PISTACHE` in `src/cast/mascot.ts`).
- His line: « Moi *aussi* ! » — once per episode, answering Noisette's offer of help.
- He is in every episode from season 2 on, unless the user says otherwise. He is the one who is
  scared, makes a mistake or wants everything for himself; Noisette helps; he ends happy.
- Signature sound (for the sound sheet): a small cute squeak when he says his line.
