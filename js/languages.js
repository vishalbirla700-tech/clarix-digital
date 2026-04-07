/* ═══════════════════════════════════════════════
   CLARIX — LANGUAGES DATA
   All Indian and World languages
═══════════════════════════════════════════════ */

const LANGUAGES = {
  indian: [
    { code:'hi',  name:'Hindi',      flag:'🇮🇳', native:'हिंदी' },
    { code:'en',  name:'English',    flag:'🌐', native:'English' },
    { code:'hi-en', name:'Hinglish', flag:'🇮🇳', native:'Hinglish' },
    { code:'bn',  name:'Bengali',    flag:'🇮🇳', native:'বাংলা' },
    { code:'te',  name:'Telugu',     flag:'🇮🇳', native:'తెలుగు' },
    { code:'mr',  name:'Marathi',    flag:'🇮🇳', native:'मराठी' },
    { code:'ta',  name:'Tamil',      flag:'🇮🇳', native:'தமிழ்' },
    { code:'gu',  name:'Gujarati',   flag:'🇮🇳', native:'ગુજરાતી' },
    { code:'kn',  name:'Kannada',    flag:'🇮🇳', native:'ಕನ್ನಡ' },
    { code:'ml',  name:'Malayalam',  flag:'🇮🇳', native:'മലയാളം' },
    { code:'pa',  name:'Punjabi',    flag:'🇮🇳', native:'ਪੰਜਾਬੀ' },
    { code:'ur',  name:'Urdu',       flag:'🇵🇰', native:'اردو' },
    { code:'or',  name:'Odia',       flag:'🇮🇳', native:'ଓଡ଼ିଆ' },
    { code:'as',  name:'Assamese',   flag:'🇮🇳', native:'অসমীয়া' },
    { code:'mai', name:'Maithili',   flag:'🇮🇳', native:'मैथिली' },
    { code:'si',  name:'Sindhi',     flag:'🇮🇳', native:'سنڌي' },
    { code:'kok', name:'Konkani',    flag:'🇮🇳', native:'कोंकणी' },
    { code:'mni', name:'Manipuri',   flag:'🇮🇳', native:'মেইতেই' },
    { code:'doi', name:'Dogri',      flag:'🇮🇳', native:'डोगरी' },
    { code:'ks',  name:'Kashmiri',   flag:'🇮🇳', native:'کٲشُر' },
    { code:'sa',  name:'Sanskrit',   flag:'🇮🇳', native:'संस्कृत' },
    { code:'sat', name:'Santali',    flag:'🇮🇳', native:'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code:'bo',  name:'Bodo',       flag:'🇮🇳', native:'बर\u0027 ' },
  ],
  world: [
    { code:'es',  name:'Spanish',    flag:'🇪🇸', native:'Español' },
    { code:'fr',  name:'French',     flag:'🇫🇷', native:'Français' },
    { code:'pt',  name:'Portuguese', flag:'🇧🇷', native:'Português' },
    { code:'de',  name:'German',     flag:'🇩🇪', native:'Deutsch' },
    { code:'it',  name:'Italian',    flag:'🇮🇹', native:'Italiano' },
    { code:'ar',  name:'Arabic',     flag:'🇸🇦', native:'العربية' },
    { code:'ja',  name:'Japanese',   flag:'🇯🇵', native:'日本語' },
    { code:'zh',  name:'Chinese',    flag:'🇨🇳', native:'中文' },
    { code:'ko',  name:'Korean',     flag:'🇰🇷', native:'한국어' },
    { code:'ru',  name:'Russian',    flag:'🇷🇺', native:'Русский' },
    { code:'nl',  name:'Dutch',      flag:'🇳🇱', native:'Nederlands' },
    { code:'tr',  name:'Turkish',    flag:'🇹🇷', native:'Türkçe' },
    { code:'pl',  name:'Polish',     flag:'🇵🇱', native:'Polski' },
    { code:'sv',  name:'Swedish',    flag:'🇸🇪', native:'Svenska' },
    { code:'id',  name:'Indonesian', flag:'🇮🇩', native:'Bahasa Indonesia' },
    { code:'ms',  name:'Malay',      flag:'🇲🇾', native:'Bahasa Melayu' },
    { code:'th',  name:'Thai',       flag:'🇹🇭', native:'ภาษาไทย' },
    { code:'vi',  name:'Vietnamese', flag:'🇻🇳', native:'Tiếng Việt' },
    { code:'el',  name:'Greek',      flag:'🇬🇷', native:'Ελληνικά' },
    { code:'cs',  name:'Czech',      flag:'🇨🇿', native:'Čeština' },
    { code:'ro',  name:'Romanian',   flag:'🇷🇴', native:'Română' },
    { code:'uk',  name:'Ukrainian',  flag:'🇺🇦', native:'Українська' },
    { code:'sw',  name:'Swahili',    flag:'🇰🇪', native:'Kiswahili' },
    { code:'fi',  name:'Finnish',    flag:'🇫🇮', native:'Suomi' },
    { code:'da',  name:'Danish',     flag:'🇩🇰', native:'Dansk' },
    { code:'no',  name:'Norwegian',  flag:'🇳🇴', native:'Norsk' },
  ]
};

/* Active language state */
const LangState = {
  get code()   { return localStorage.getItem('clarix_lang') || 'en'; },
  get name()   { return localStorage.getItem('clarix_lang_name') || 'English'; },
  get flag()   { return localStorage.getItem('clarix_lang_flag') || '🌐'; },
  get native() { return localStorage.getItem('clarix_lang_native') || 'English'; },

  set(code, name, flag, native) {
    localStorage.setItem('clarix_lang', code);
    localStorage.setItem('clarix_lang_name', name);
    localStorage.setItem('clarix_lang_flag', flag);
    localStorage.setItem('clarix_lang_native', native);
  },

  getAll() {
    return [...LANGUAGES.indian, ...LANGUAGES.world];
  },

  find(code) {
    return this.getAll().find(l => l.code === code);
  },

  getLangPromptSuffix() {
    const n = this.name;
    if (n === 'English') return '';
    return ` Respond in ${n}.`;
  }
};
