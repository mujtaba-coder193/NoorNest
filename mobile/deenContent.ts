export const DAILY_DUAS = [
  {
    id: 'wake',
    title: 'Waking up',
    cue: 'When we wake',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    meaning: 'All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.',
    sources: [{ label: 'Sahih al-Bukhari 6324', url: 'https://sunnah.com/bukhari:6324' }],
  },
  {
    id: 'sleep',
    title: 'Going to sleep',
    cue: 'At bedtime',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya.',
    meaning: 'In Your name, O Allah, I die and I live.',
    sources: [{ label: 'Sahih al-Bukhari 6324', url: 'https://sunnah.com/bukhari:6324' }],
  },
  {
    id: 'restroom-in',
    title: 'Entering the restroom',
    cue: 'Before entering',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: "Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.",
    meaning: 'O Allah, I seek refuge in You from male and female devils.',
    sources: [
      { label: 'Sahih al-Bukhari 142', url: 'https://sunnah.com/bukhari:142' },
      { label: 'Sahih Muslim 375', url: 'https://sunnah.com/muslim:375' },
    ],
  },
  {
    id: 'restroom-out',
    title: 'Leaving the restroom',
    cue: 'After leaving',
    arabic: 'غُفْرَانَكَ',
    transliteration: 'Ghufranak.',
    meaning: 'I ask You for forgiveness.',
    sources: [{ label: 'Sunan Abi Dawud 30', url: 'https://sunnah.com/abudawud:30' }],
  },
  {
    id: 'home',
    title: 'Entering home',
    cue: 'As we come home',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala rabbina tawakkalna.",
    meaning: "In Allah's name we enter, in Allah's name we leave, and upon Allah, our Lord, we rely.",
    sources: [{ label: 'Sunan Abi Dawud 5096', url: 'https://sunnah.com/abudawud:5096' }],
  },
] as const;

export const QURAN_SURAHS = [
  {
    number: 1,
    name: 'Al-Fatihah',
    arabicName: 'الْفَاتِحَة',
    audioUrl: 'https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/1.mp3',
    verses: [
      { arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'In the name of Allah, the Beneficent, the Merciful.', startMs: 0, endMs: 3080 },
      { arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ', translation: 'Praise be to Allah, Lord of the Worlds,', startMs: 3080, endMs: 7570 },
      { arabic: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'The Beneficent, the Merciful.', startMs: 7570, endMs: 10680 },
      { arabic: 'مَـٰلِكِ يَوْمِ ٱلدِّينِ', translation: 'Master of the Day of Judgment,', startMs: 10680, endMs: 14130 },
      { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'Thee (alone) we worship; Thee (alone) we ask for help.', startMs: 14130, endMs: 19070 },
      { arabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', translation: 'Show us the straight path,', startMs: 19070, endMs: 23280 },
      { arabic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', translation: 'The path of those whom Thou hast favoured; Not the (path) of those who earn Thine anger nor of those who go astray.', startMs: 23280, endMs: 34930 },
    ],
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الْإِخْلَاص',
    audioUrl: 'https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/112.mp3',
    verses: [
      { arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translation: 'Say: He is Allah, the One!', startMs: 0, endMs: 2950 },
      { arabic: 'ٱللَّهُ ٱلصَّمَدُ', translation: 'Allah, the eternally Besought of all!', startMs: 2950, endMs: 5510 },
      { arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translation: 'He begetteth not nor was begotten.', startMs: 5510, endMs: 8280 },
      { arabic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', translation: 'And there is none comparable unto Him.', startMs: 8280, endMs: 12850 },
    ],
  },
  {
    number: 113,
    name: 'Al-Falaq',
    arabicName: 'الْفَلَق',
    audioUrl: 'https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/113.mp3',
    verses: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ', translation: 'Say: I seek refuge in the Lord of the Daybreak', startMs: 0, endMs: 3190 },
      { arabic: 'مِن شَرِّ مَا خَلَقَ', translation: 'From the evil of that which He created;', startMs: 3190, endMs: 6040 },
      { arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'From the evil of the darkness when it is intense,', startMs: 6040, endMs: 10430 },
      { arabic: 'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ', translation: 'And from the evil of malignant witchcraft,', startMs: 10430, endMs: 15580 },
      { arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translation: 'And from the evil of the envier when he envieth.', startMs: 15580, endMs: 21430 },
    ],
  },
  {
    number: 114,
    name: 'An-Nas',
    arabicName: 'النَّاس',
    audioUrl: 'https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/114.mp3',
    verses: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ', translation: 'Say: I seek refuge in the Lord of mankind,', startMs: 0, endMs: 3450 },
      { arabic: 'مَلِكِ ٱلنَّاسِ', translation: 'The King of mankind,', startMs: 3450, endMs: 5510 },
      { arabic: 'إِلَـٰهِ ٱلنَّاسِ', translation: 'The God of mankind,', startMs: 5510, endMs: 8850 },
      { arabic: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', translation: 'From the evil of the sneaking whisperer,', startMs: 8850, endMs: 14940 },
      { arabic: 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ', translation: 'Who whispereth in the hearts of mankind,', startMs: 14940, endMs: 20190 },
      { arabic: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ', translation: 'Of the jinn and of mankind.', startMs: 20190, endMs: 26170 },
    ],
  },
] as const;

export const QURAN_TRANSLATION_SOURCE = 'M. Pickthall (1930), via Quran.com';
