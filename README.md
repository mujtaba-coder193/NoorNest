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
   flower, and sport. The current symbol list is project-supplied and still
   needs source verification.
4. **Nature gallery:** Browse unique animals, birds, fish, and flowers in
	separate categories, without linking them to country pages. Show up to three
	Wikimedia Commons photos per entry with visible creator and license credits.
	Tapping a photo opens a detail modal. Animals and birds offer playback only
	when a matching iNaturalist recording with an accepted license is available;
	flowers have no sound control. Shapes and colors are a later story.
5. **Fruits and vegetables:** Browse a starter catalog of 35 common fruits and
	35 common vegetables in alphabetical order, with pictures, spoken names,
	short nutrient facts attributed to USDA FoodData Central, and caregiver
	safety guidance. This is general information, not feeding advice or an
	exhaustive list of every cultivar.
6. **Daily duas:** Add short supplications for waking, sleeping, entering and
	leaving the restroom, and entering home, with Arabic, transliteration,
	English meaning, and hadith references. Review wording and references with
	a trusted religious authority before release. For an infant, these are
	parent-recited routines, not a memorization expectation.
7. **Qur'an collection:** Present Al-Fatihah and the three Quls verse by verse,
	with Arabic and M. Pickthall's public-domain English translation sourced
	from Quran.com. Stream Sheikh Abdur-Rahman as-Sudais's recitation from
	QuranicAudio via Quran.com's recitation API. Confirm provider usage terms
	before public release; keep reciter and source attribution visible.
8. **Next Deen topics:** Introduce angels and Shaytan; Jannah and Jahannam;
	major prophets; revealed books; major Sahaba; and the Hijri calendar months
	through reviewed, gentle, parent-led content.
9. **Parent area and media:** Add parent-managed, curated audio/video and
	offline access before introducing any external links.
10. **More languages:** Adapt content for Arabic, Urdu, and Norwegian, including
	right-to-left layouts for Arabic and Urdu.

## Current prototype

The app opens on a Home dashboard with Deen and Dunya paths. English Letters
opens a parent-led A–Z listening moment. Daily Duas contains routine-based
supplications with clickable hadith references. The Qur'an section contains
Al-Fatihah and the three Quls with English translation, streamed Sheikh Sudais
recitation, and a verse highlight synchronized from recitation timestamps. The
Countries Explorer lists 195 countries with flags, capitals, basic facts, and
the supplied national animal, bird, flower, and sport text. The separate Nature
Gallery shows deduplicated animals, birds, fish, and flowers with up to three photos.
Photo and sound credits link to their source pages. The Fruits and Vegetables
gallery adds sourced nutrition notes, spoken food names, and a caregiver safety
note. Symbol claims are not independently verified. The prototype does not ask
a baby to use the app alone.

## Country data attribution

The bundled country dataset comes from [world-countries](https://github.com/mledoze/countries)
by M. Le Doze and is licensed under ODbL-1.0. National symbols are imported
from the project-supplied `data.csv`; their accuracy and official status have
not yet been independently verified. Gallery photos are fetched from Wikimedia
Commons and each photo links to its individual creator, license, and source
page. Verify each image's relevance and usage terms before public release.

## Try it on an iPhone

1. Install **Expo Go** from the App Store.
2. Sign in to Expo Go with the Expo account you want to use for development.
	The Expo CLI and Expo Go accounts must match.
3. If the CLI is not logged in, sign in to [expo.dev](https://expo.dev) with
	that same account and create a personal access token from the personal
	account settings. Do not create a robot user for this personal preview.
4. In a VS Code terminal, enter the app folder:

	```bash
	cd /workspaces/NoorNest/mobile
	```

5. If needed, load the personal token into that terminal without displaying
	it. Run this line by itself, then paste the token only when the hidden
	prompt appears and press Enter:

	```bash
	read -s "EXPO_TOKEN?Paste your Expo access token (hidden): "
	```

6. In the same terminal, export the token and verify the account:

	```bash
	echo
	export EXPO_TOKEN
	npx expo whoami
	```

	Confirm the username matches the account signed in to Expo Go. If it does
	not, create a token from the correct personal account and repeat these
	steps in the same terminal.
7. Start the tunnel in that same terminal:

	```bash
	npx expo start --tunnel
	```

8. When the Expo QR appears, scan it with the iPhone Camera app and tap
	**Open in Expo Go**. Keep the terminal and server running while testing.

Never paste an access token into a source file, README, or chat. If a token is
exposed, revoke it in Expo account settings and create a new one. If port 8081
is already running this app, use that existing server or stop it before starting
another preview.

Speech uses the iPhone's English text-to-speech voice. Turn off silent mode if
you cannot hear it. This is a development preview; TestFlight distribution and
App Store release will be a later step.
