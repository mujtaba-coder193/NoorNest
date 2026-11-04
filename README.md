# NoorNest
A little world of learning, love and light.

## Product stories

1. **Parent-first home:** A caregiver chooses a short shared moment from the
	Deen or Dunya paths. English is the first interface language.
2. **English sound moments:** Explore one large letter and a familiar picture
	at a time; the caregiver can play the letter or word again and move at the
	baby's pace. No quizzes, streaks, timers, or child progress scores.
3. **Countries Explorer:** Browse 195 countries alphabetically, with flags,
   capitals, region, official languages, currency, national animal, bird,
   flower, and sport. National-symbol images are a later story. The current
   symbol list is project-supplied and still needs source verification.
4. **More English Dunya:** Add numbers, animals, fruits, and vegetables as
	simple picture-and-audio moments. Shapes and colors are a later story.
5. **Daily duas:** Add short supplications for waking, sleeping, entering and
	leaving the restroom, and entering home, with Arabic, transliteration,
	English meaning, and hadith references. Review wording and references with
	a trusted religious authority before release. For an infant, these are
	parent-recited routines, not a memorization expectation.
6. **Qur'an collection:** Present Al-Fatihah and the three Quls verse by verse,
	with Arabic and M. Pickthall's public-domain English translation sourced
	from Quran.com. Stream Sheikh Abdur-Rahman as-Sudais's recitation from
	QuranicAudio via Quran.com's recitation API. Confirm provider usage terms
	before public release; keep reciter and source attribution visible.
7. **Next Deen topics:** Introduce angels and Shaytan; Jannah and Jahannam;
	major prophets; revealed books; major Sahaba; and the Hijri calendar months
	through reviewed, gentle, parent-led content.
8. **Parent area and media:** Add parent-managed, curated audio/video and
	offline access before introducing any external links.
9. **More languages:** Adapt content for Arabic, Urdu, and Norwegian, including
	right-to-left layouts for Arabic and Urdu.

## Current prototype

The app opens on a Home dashboard with Deen and Dunya paths. English Letters
opens a parent-led A–Z listening moment. Daily Duas contains routine-based
supplications with clickable hadith references. The Qur'an section contains
Al-Fatihah and the three Quls with English translation, streamed Sheikh Sudais
recitation, and a verse highlight synchronized from recitation timestamps. The
Countries Explorer lists 195 countries with flags, capitals, basic facts, and
the supplied national animal, bird, flower, and sport text. Symbol images are
planned later, and symbol claims are not independently verified. The prototype
does not ask a baby to use the app alone.

## Country data attribution

The bundled country dataset comes from [world-countries](https://github.com/mledoze/countries)
by M. Le Doze and is licensed under ODbL-1.0. National symbols are imported
from the project-supplied `data.csv`; their accuracy and official status have
not yet been independently verified. Symbol images are deferred.

## Try it on an iPhone

1. Install **Expo Go** from the App Store.
2. From this repository, run `cd mobile && npm start -- --tunnel`.
3. Scan the QR code shown in the terminal with the iPhone camera and open it in
	Expo Go.

Speech uses the iPhone's English text-to-speech voice. Turn off silent mode if
you cannot hear it. This is a development preview; TestFlight distribution and
App Store release will be a later step.
