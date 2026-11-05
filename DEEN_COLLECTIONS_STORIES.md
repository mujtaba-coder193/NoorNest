# Deen Collections: Product Stories and Build Context

**Status:** Product handoff for a future implementation. This file describes what to build; it does not change the app.

## Product Context

NoorNest is an English-first Expo and React Native learning app for children around ages 1–3. Experiences are designed for a parent or caregiver to share with a child, not for independent use or memorization pressure. The app already has Deen paths for daily duas, Qur’an, selected names of Allah, and names of Prophet Muhammad ﷺ.

Relevant implementation points:

- Home modules and screen routing are in `mobile/App.tsx`.
- Deen content arrays are in `mobile/deenContent.ts`.
- The existing names experience is in `mobile/BeautifulNamesScreen.tsx`.
- The app uses `expo-speech` for spoken names and meanings. Arabic voice availability depends on the device; do not claim a voice is a verified recitation.
- Read `mobile/AGENTS.md` before changing app code. Use the existing Expo SDK and dependencies; do not add a package unless the feature truly requires it.
- There is a routing mismatch to resolve: the current prototype switches screens with state in `App.tsx`, while `mobile/AGENTS.md` asks for Expo Router. Inspect the actual app setup and follow the repo instructions without doing a broad routing migration unless it is required for these stories.
- Preserve the existing names-of-Allah and Prophet-name features. Add the collections below as new, separate paths.

## Content Principles

- Keep each child-facing sentence short, warm, and concrete. Offer a caregiver-led moment; never imply that a toddler must memorize or understand theological detail.
- Keep audio user-initiated. Do not autoplay speech or recitation.
- For every historical or religious claim, provide a source reference that a caregiver can open. Do not invent a quotation, event, rank, virtue, or role to make a story more exciting.
- Treat transliteration and English meaning as learning aids, not exact equivalents of Arabic. Have Arabic pronunciation and translations reviewed before release. Prefer a qualified human recording for Arabic pronunciation when available; otherwise clearly treat device speech as a convenience, not recitation.
- Do not depict Allah, Prophet Muhammad ﷺ, other prophets, or angels. Use typography, geometric patterns, nature imagery, or abstract motifs instead.
- Avoid frightening imagery and punishment-focused descriptions for this age group. Keep angels' roles to brief, source-grounded facts.
- This app is not a religious authority. Mark content as caregiver-led and have a knowledgeable reviewer check it before public release.

## Story 1: The Ten Companions Promised Jannah

**As a caregiver, I want to explore the ten companions named in a hadith about Jannah, so I can introduce their names respectfully and share a short, sourced moment with my child.**

Starter roster, following Jami` at-Tirmidhi 3747:

1. Abu Bakr as-Siddiq (Abdullah ibn Abi Quhafa)
2. Umar ibn al-Khattab
3. Uthman ibn Affan
4. Ali ibn Abi Talib
5. Talhah ibn Ubaydillah
6. Az-Zubayr ibn al-Awwam
7. Abd al-Rahman ibn Awf
8. Sa'd ibn Abi Waqqas
9. Sa'id ibn Zayd
10. Abu Ubaydah ibn al-Jarrah

**Acceptance criteria**

- Show all ten names, with consistent spelling and a reviewed Arabic form/transliteration before release.
- State carefully that these ten companions are individually named in the cited report as being in Paradise. Do not imply this is a complete list of everyone promised Jannah.
- Each detail can include one short, verified biographical fact or gentle character lesson. Keep that fact optional until a reliable source is attached and reviewed.
- Provide a name-list audio action and an English name action. Do not synthesize a made-up story as if it were a narration.
- Include a visible, tappable source: [Jami` at-Tirmidhi 3747](https://sunnah.com/tirmidhi:3747). Sunnah.com displays this report as Sahih (Darussalam); retain the collection and number in the UI.
- Avoid presenting the companions as fictional characters or inventing dialogue.

## Story 2: The Wives of Prophet Muhammad ﷺ

**As a caregiver, I want to browse the Mothers of the Believers, so I can learn their names and share respectful, true examples of their lives.**

Commonly taught roster of the Prophet's wives:

1. Khadijah bint Khuwaylid
2. Sawdah bint Zam'ah
3. Aisha bint Abi Bakr
4. Hafsa bint Umar
5. Zaynab bint Khuzayma
6. Umm Salama (Hind bint Abi Umayya)
7. Zaynab bint Jahsh
8. Juwayriya bint al-Harith
9. Umm Habiba (Ramlah bint Abi Sufyan)
10. Safiyya bint Huyayy
11. Maymunah bint al-Harith

**Acceptance criteria**

- Use the honorific “Mothers of the Believers,” grounded in [Qur'an 33:6](https://quran.com/33/6). Explain the honorific for caregivers if needed; do not turn it into a claim that the wives are the child's biological mothers.
- Show a reviewed Arabic name and transliteration for each person. Include alternate personal names in parentheses where useful, as above.
- Offer one short, verified biographical moment per person only when it has a traceable source. Link the specific hadith or a recognized seerah reference; do not attach Qur'an 33:6 to individual biographical claims it does not establish.
- Keep the scope explicit: this is a collection of the Prophet's wives. Historical counts can vary when other relationships are included; do not silently add someone to this roster without a reviewed source and clear explanation.
- Do not portray the Prophet ﷺ or his wives. Use non-figurative visual treatment.
- Include source context such as [Qur'an 33:6](https://quran.com/33/6) and [Qur'an 33:50](https://quran.com/33/50), plus specific sources for any individual story.

## Story 3: Angels Named in the Qur'an and Authentic Reports

**As a caregiver, I want a gentle introduction to a few named angels and what reliable sources say, so I can share basic Islamic belief without frightening or speculative stories.**

Recommended first set:

- **Jibril (Gabriel):** the Qur'an describes him bringing revelation. Sources: [Qur'an 2:97](https://quran.com/2/97) and [Qur'an 26:193–194](https://quran.com/26/193).
- **Mika'il (Michael):** named in [Qur'an 2:98](https://quran.com/2/98). Do not assign a detailed job or story unless a separate reliable source is provided.
- **Israfil:** named alongside Jibril and Mika'il in a supplication reported in [Sahih Muslim 770](https://sunnah.com/muslim:770). Keep the description to what the source supports.

**Acceptance criteria**

- Clearly distinguish a Qur'anic reference from a hadith reference.
- Provide an Arabic name, reviewed transliteration, short child-appropriate description, listen controls, and source link for each entry.
- Do not show angel figures, wings, faces, or imagined appearances. Use abstract, non-figurative visuals.
- Do not add a named angel or role based only on a popular unsourced story. In particular, do not state “Azrael” as a Qur'anic name for the Angel of Death.
- Keep Harut and Marut out of the toddler starter set: their Qur'anic context is complex and mentions magic ([Qur'an 2:102](https://quran.com/2/102)). Keep Malik and punishment-focused material out of this first experience as well.
- A general source about angels being created from light is [Sahih Muslim 2996](https://sunnah.com/muslim:2996); do not extend it into descriptions of their appearance.

## Shared Experience Requirements

- Add one discoverable Home module for each collection under Deen. Update the displayed Deen path count when the modules are added.
- Use large, calm, high-contrast type and generous tap targets. Make the current item obvious and support simple scrolling; do not add quizzes, timers, streaks, points, or child progress scores.
- Each item should have a focused detail state with the name, Arabic form, transliteration, short meaning/fact, audio controls, and source link(s).
- Audio controls must distinguish “Hear name” from “Hear meaning.” Use existing speech support where appropriate, handle unavailable Arabic voices gracefully, and do not autoplay.
- Make long names and source labels wrap on narrow screens. Ensure links and buttons have accessibility labels and selected states.
- Preserve attribution and citation details. Do not reproduce long copyrighted translations or story text; summarize in original, age-appropriate language.
- Keep the implementation focused: reuse the existing Deen card, header, navigation, and reference-link patterns. Do not refactor unrelated screens.

## Suggested Content Data Shape

Use the existing conventions in `mobile/deenContent.ts`. A content record can contain:

```ts
type DeenPersonOrAngel = {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  meaningOrFact: string;
  references: { label: string; url: string }[];
};
```

Keep source-specific facts beside the record they support. Do not use one general citation to imply that every fact in a collection comes from that source.

## Implementation Prompt for Claude

Implement the three product stories in this file in the existing NoorNest mobile app. First inspect the current Home routing, Deen data, and existing names screen. Add the ten companions, the Prophet's wives, and the recommended starter angels as separate Deen paths. Reuse existing React Native and Expo patterns and `expo-speech`; do not replace or rewrite the existing 99 names of Allah or Prophet Muhammad ﷺ paths. Keep the app caregiver-led for ages 1–3, source every factual claim, use non-figurative religious visuals, and leave unsupported or disputed content out. Follow `mobile/AGENTS.md`, make only focused changes, then run `./node_modules/.bin/tsc --noEmit` and `npx expo lint` from `mobile/`. Report any content that still needs a knowledgeable religious review.
