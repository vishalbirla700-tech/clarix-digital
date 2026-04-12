/* ═══════════════════════════════════════════════
   CLARIX — FIREBASE AUTH + FIRESTORE SYNC
   Google Login → Country detect → Trial sync
═══════════════════════════════════════════════ */

/* Firebase config */
var FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAM4ge2l11JSwtkC4Hzp9PDSjQDw-hAsZU",
  authDomain:        "clarix-firebase.firebaseapp.com",
  projectId:         "clarix-firebase",
  storageBucket:     "clarix-firebase.firebasestorage.app",
  messagingSenderId: "24399996790",
  appId:             "1:24399996790:web:1a337ec0707165fa123c57",
  measurementId:     "G-01WJLJZGXE"
};

/* Country → preferred languages map */
var COUNTRY_LANGUAGES = {
  'IN': ['Hindi','Gujarati','Marathi','Tamil','Telugu','Kannada','Punjabi','Bengali','Urdu','English'],
  'PK': ['Urdu','Punjabi','English','Sindhi'],
  'BD': ['Bengali','English'],
  'AE': ['Arabic','English','Hindi','Urdu'],
  'SA': ['Arabic','English'],
  'QA': ['Arabic','English'],
  'KW': ['Arabic','English'],
  'BH': ['Arabic','English'],
  'OM': ['Arabic','English'],
  'US': ['English','Spanish','French'],
  'GB': ['English','Welsh','Punjabi','Urdu'],
  'CA': ['English','French'],
  'AU': ['English'],
  'NZ': ['English','Maori'],
  'SG': ['English','Chinese','Malay','Tamil'],
  'MY': ['Malay','English','Chinese','Tamil'],
  'ZA': ['English','Zulu','Afrikaans'],
  'NG': ['English','Yoruba','Hausa','Igbo'],
  'KE': ['English','Swahili'],
  'DEFAULT': ['English','Spanish','French','Arabic','Hindi']
};

/* Country → festivals map */
var COUNTRY_FESTIVALS_DB = {
  'IN': [
    { name:'Diwali',          emoji:'🪔', emoji2:'✨🪔✨', grad:['#ff6b00','#ffc300','#ff8c00'] },
    { name:'Holi',            emoji:'🎨', emoji2:'🌈🎨🌈', grad:['#e91e8c','#ff5722','#9c27b0'] },
    { name:'Eid ul-Fitr',     emoji:'🌙', emoji2:'⭐🌙⭐', grad:['#1a237e','#283593','#4caf50'] },
    { name:'Navratri',        emoji:'💃', emoji2:'🌺💃🌺', grad:['#c2185b','#e91e63','#ff5722'] },
    { name:'Dussehra',        emoji:'🏹', emoji2:'⚡🏹⚡', grad:['#e65100','#ff6f00','#ffd600'] },
    { name:'Ganesh Chaturthi',emoji:'🐘', emoji2:'🌺🐘🌺', grad:['#ff6f00','#ffa000','#ffd600'] },
    { name:'Durga Puja',      emoji:'🌸', emoji2:'🪷🌸🪷', grad:['#b71c1c','#c62828','#ff8f00'] },
    { name:'Christmas',       emoji:'🎄', emoji2:'⭐🎄⭐', grad:['#1b5e20','#2e7d32','#c62828'] },
    { name:'Onam',            emoji:'🌺', emoji2:'🛶🌺🛶', grad:['#1b5e20','#33691e','#ffd600'] },
    { name:'Pongal',          emoji:'🌾', emoji2:'🌞🌾🌞', grad:['#e65100','#f57f17','#33691e'] },
    { name:'Baisakhi',        emoji:'🌾', emoji2:'💛🌾💛', grad:['#f57f17','#ffa000','#33691e'] },
    { name:"Valentine's Day", emoji:'❤️', emoji2:'💕❤️💕', grad:['#b71c1c','#c62828','#e91e63'] }
  ],
  'AE': [
    { name:'Eid ul-Fitr',     emoji:'🌙', emoji2:'⭐🌙⭐', grad:['#1a237e','#283593','#4caf50'] },
    { name:'Eid ul-Adha',     emoji:'🐑', emoji2:'🌙🐑🌙', grad:['#1b5e20','#2e7d32','#1a237e'] },
    { name:'Ramadan',         emoji:'🌙', emoji2:'✨🌙✨', grad:['#0d47a1','#1565c0','#6a1b9a'] },
    { name:'UAE National Day',emoji:'🇦🇪', emoji2:'🎉🇦🇪🎉', grad:['#006400','#c8102e','#000000'] },
    { name:'New Year',        emoji:'🎆', emoji2:'🥂🎆🥂', grad:['#1a237e','#283593','#b71c1c'] },
    { name:'Diwali',          emoji:'🪔', emoji2:'✨🪔✨', grad:['#ff6b00','#ffc300','#ff8c00'] },
    { name:'Christmas',       emoji:'🎄', emoji2:'⭐🎄⭐', grad:['#1b5e20','#2e7d32','#c62828'] }
  ],
  'SA': [
    { name:'Eid ul-Fitr',     emoji:'🌙', emoji2:'⭐🌙⭐', grad:['#1a237e','#283593','#4caf50'] },
    { name:'Eid ul-Adha',     emoji:'🐑', emoji2:'🌙🐑🌙', grad:['#1b5e20','#2e7d32','#1a237e'] },
    { name:'Ramadan',         emoji:'🌙', emoji2:'✨🌙✨', grad:['#0d47a1','#1565c0','#6a1b9a'] },
    { name:'Saudi National Day',emoji:'🇸🇦',emoji2:'🎉🇸🇦🎉',grad:['#006400','#000000','#006400'] },
    { name:'New Year',        emoji:'🎆', emoji2:'🥂🎆🥂', grad:['#1a237e','#283593','#b71c1c'] }
  ],
  'US': [
    { name:'Christmas',       emoji:'🎄', emoji2:'⭐🎄⭐', grad:['#1b5e20','#2e7d32','#c62828'] },
    { name:'Thanksgiving',    emoji:'🦃', emoji2:'🍂🦃🍂', grad:['#e65100','#bf360c','#f57f17'] },
    { name:'Halloween',       emoji:'🎃', emoji2:'👻🎃👻', grad:['#e65100','#4a148c','#1a237e'] },
    { name:'New Year',        emoji:'🎆', emoji2:'🥂🎆🥂', grad:['#1a237e','#283593','#b71c1c'] },
    { name:"Valentine's Day", emoji:'❤️', emoji2:'💕❤️💕', grad:['#b71c1c','#c62828','#e91e63'] },
    { name:"4th of July",     emoji:'🇺🇸', emoji2:'🎆🇺🇸🎆',grad:['#b71c1c','#ffffff','#1a237e'] },
    { name:"Mother's Day",    emoji:'🌷', emoji2:'💐🌷💐', grad:['#e91e63','#f06292','#ad1457'] },
    { name:'Easter',          emoji:'🐣', emoji2:'🌸🐣🌸', grad:['#9c27b0','#7b1fa2','#1b5e20'] }
  ],
  'GB': [
    { name:'Christmas',       emoji:'🎄', emoji2:'⭐🎄⭐', grad:['#1b5e20','#2e7d32','#c62828'] },
    { name:'New Year',        emoji:'🎆', emoji2:'🥂🎆🥂', grad:['#1a237e','#283593','#b71c1c'] },
    { name:'Easter',          emoji:'🐣', emoji2:'🌸🐣🌸', grad:['#9c27b0','#7b1fa2','#1b5e20'] },
    { name:"Valentine's Day", emoji:'❤️', emoji2:'💕❤️💕', grad:['#b71c1c','#c62828','#e91e63'] },
    { name:'Bonfire Night',   emoji:'🔥', emoji2:'✨🔥✨', grad:['#e65100','#bf360c','#1a237e'] },
    { name:'Diwali',          emoji:'🪔', emoji2:'✨🪔✨', grad:['#ff6b00','#ffc300','#ff8c00'] }
  ],
  'SG': [
    { name:'Chinese New Year',emoji:'🧧', emoji2:'🐉🧧🐉', grad:['#b71c1c','#c62828','#f57f17'] },
    { name:'Diwali',          emoji:'🪔', emoji2:'✨🪔✨', grad:['#ff6b00','#ffc300','#ff8c00'] },
    { name:'Hari Raya',       emoji:'🌙', emoji2:'⭐🌙⭐', grad:['#1a237e','#283593','#4caf50'] },
    { name:'National Day',    emoji:'🇸🇬', emoji2:'🎉🇸🇬🎉',grad:['#c62828','#ffffff','#c62828'] },
    { name:'Christmas',       emoji:'🎄', emoji2:'⭐🎄⭐', grad:['#1b5e20','#2e7d32','#c62828'] },
    { name:'New Year',        emoji:'🎆', emoji2:'🥂🎆🥂', grad:['#1a237e','#283593','#b71c1c'] }
  ],
  'DEFAULT': [
    { name:'Christmas',       emoji:'🎄', emoji2:'⭐🎄⭐', grad:['#1b5e20','#2e7d32','#c62828'] },
    { name:'New Year',        emoji:'🎆', emoji2:'🥂🎆🥂', grad:['#1a237e','#283593','#b71c1c'] },
    { name:"Valentine's Day", emoji:'❤️', emoji2:'💕❤️💕', grad:['#b71c1c','#c62828','#e91e63'] },
    { name:'Eid ul-Fitr',     emoji:'🌙', emoji2:'⭐🌙⭐', grad:['#1a237e','#283593','#4caf50'] },
    { name:'Easter',          emoji:'🐣', emoji2:'🌸🐣🌸', grad:['#9c27b0','#7b1fa2','#1b5e20'] },
    { name:'Diwali',          emoji:'🪔', emoji2:'✨🪔✨', grad:['#ff6b00','#ffc300','#ff8c00'] }
  ]
};

/* ── Firebase Auth State ── */
var ClarixAuth = {
  _app:  null,
  _auth: null,
  _db:   null,
  currentUser: null,
  userProfile: null,  /* { uid, email, name, photo, country, countryCode, language, trialUsed, isPro } */
  _ready: false,
  _readyCallbacks: [],

  /* Detect mobile browsers — popup is blocked on mobile, use redirect */
  _isMobile: function() {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  init: function() {
    /* Load Firebase SDKs dynamically */
    var self = this;
    if (typeof firebase !== 'undefined') {
      self._setup();
      return;
    }
    /* SDK not loaded yet — wait */
    var t = setInterval(function() {
      if (typeof firebase !== 'undefined') {
        clearInterval(t);
        self._setup();
      }
    }, 100);
  },

  _setup: function() {
    var self = this;
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      self._auth = firebase.auth();
      self._db   = firebase.firestore();

      /* ── Handle redirect result first (mobile sign-in flow) ── */
      self._auth.getRedirectResult().then(function(result) {
        /* result.user is null if no redirect happened — that's fine */
        if (result && result.user) {
          /* Auth state listener below will pick this up automatically */
          console.log('Clarix: redirect sign-in success', result.user.email);
        }
      }).catch(function(e) {
        console.error('Redirect result error:', e);
        /* Reset any stuck button state */
        var btn = document.getElementById('clarixGoogleSignIn');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style="width:20px;height:20px;margin-right:10px;">Continue with Google';
        }
      });

      self._auth.onAuthStateChanged(function(user) {
        if (user) {
          self.currentUser = user;
          self._loadProfile(user, function() {
            self._ready = true;
            self._readyCallbacks.forEach(function(cb) { cb(user); });
            self._readyCallbacks = [];
            /* Hide login modal if open */
            var modal = document.getElementById('clarix-login-modal');
            if (modal) modal.remove();
            /* Start onboarding if new user */
            if (!self.userProfile.onboarded) {
              self._showCountryOnboarding();
            } else {
              /* Apply saved language + festivals */
              self._applyUserSettings();
            }
          });
        } else {
          self.currentUser = null;
          self.userProfile = null;
          self._ready = false;
          self._showLoginModal();
        }
      });
    } catch(e) {
      console.error('Firebase init error:', e);
    }
  },

  onReady: function(cb) {
    if (this._ready) cb(this.currentUser);
    else this._readyCallbacks.push(cb);
  },

  /* ── Load / create Firestore profile ── */
  _loadProfile: function(user, done) {
    var self = this;
    var ref = self._db.collection('users').doc(user.uid);
    ref.get().then(function(doc) {
      if (doc.exists) {
        self.userProfile = doc.data();
        /* Sync isPro to localStorage for ClarixState */
        localStorage.setItem('clarix_pro', self.userProfile.isPro ? 'true' : 'false');
        localStorage.setItem('clarix_username', self.userProfile.name || user.displayName || 'Creator');
        /* Sync trial count FROM Firestore → localStorage (source of truth is Firestore) */
        if (typeof self.userProfile.trialUsed === 'number') {
          localStorage.setItem('clarix_trial_used', self.userProfile.trialUsed);
        }
        done();
      } else {
        /* NEW USER — create profile */
        var profile = {
          uid:         user.uid,
          email:       user.email || '',
          name:        user.displayName || 'Creator',
          photo:       user.photoURL || '',
          country:     '',
          countryCode: '',
          countryFlag: '',
          language:    'English',
          langCode:    'en',
          trialUsed:   parseInt(localStorage.getItem('clarix_trial_used') || '0'),
          dailyUsage:  { date: '', count: 0 },
          isPro:       false,
          onboarded:   false,
          createdAt:   firebase.firestore.FieldValue.serverTimestamp()
        };
        /* Detect country before saving */
        self._detectCountry(function(countryData) {
          profile.country     = countryData.country || 'Unknown';
          profile.countryCode = countryData.code    || 'DEFAULT';
          profile.countryFlag = countryData.flag    || '🌍';
          ref.set(profile).then(function() {
            self.userProfile = profile;
            localStorage.setItem('clarix_username', profile.name);
            done();
          });
        });
      }
    }).catch(function(e) {
      console.error('Firestore load error:', e);
      self.userProfile = { name: user.displayName || 'Creator', onboarded: true, isPro: false, trialUsed: 0, countryCode: 'IN' };
      done();
    });
  },

  /* ── Country detection via free IP API ── */
  _detectCountry: function(cb) {
    fetch('https://ipapi.co/json/')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var code = data.country_code || 'DEFAULT';
        var flagMap = {
          'IN':'🇮🇳','AE':'🇦🇪','SA':'🇸🇦','US':'🇺🇸','GB':'🇬🇧',
          'PK':'🇵🇰','BD':'🇧🇩','SG':'🇸🇬','MY':'🇲🇾','CA':'🇨🇦',
          'AU':'🇦🇺','QA':'🇶🇦','KW':'🇰🇼','NG':'🇳🇬','KE':'🇰🇪'
        };
        cb({ country: data.country_name, code: code, flag: flagMap[code] || '🌍' });
      })
      .catch(function() {
        cb({ country: 'India', code: 'IN', flag: '🇮🇳' }); /* Default to India */
      });
  },

  /* ── Google Sign-In ── */
  /* Mobile: use redirect (popup is blocked by mobile browsers)
     Desktop: use popup for instant UX */
  signInWithGoogle: function() {
    var self = this;
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    /* Always add hint so Google shows account chooser, not email input */
    provider.setCustomParameters({ prompt: 'select_account' });

    if (self._isMobile()) {
      /* Redirect flow — page will reload after sign-in */
      return self._auth.signInWithRedirect(provider).catch(function(e) {
        console.error('Redirect sign-in error:', e);
        var btn = document.getElementById('clarixGoogleSignIn');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style="width:20px;height:20px;margin-right:10px;">Continue with Google';
        }
        if (typeof Toast !== 'undefined') Toast.show('Sign-in failed. Please try again.', 'error');
      });
    } else {
      /* Desktop popup flow */
      return self._auth.signInWithPopup(provider).catch(function(e) {
        var btn = document.getElementById('clarixGoogleSignIn');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style="width:20px;height:20px;margin-right:10px;">Continue with Google';
        }
        if (typeof Toast !== 'undefined') Toast.show('Sign-in failed. Please try again.', 'error');
      });
    }
  },

  signOut: function() {
    var self = this;
    return self._auth.signOut().then(function() {
      self.currentUser = null;
      self.userProfile = null;
      localStorage.removeItem('clarix_pro');
      window.location.href = '/';
    });
  },

  /* ── Save field to Firestore ── */
  saveField: function(key, value) {
    if (!this.currentUser) return;
    var update = {};
    update[key] = value;
    this._db.collection('users').doc(this.currentUser.uid).update(update).catch(function(e) {
      console.warn('Firestore save error:', e);
    });
  },

  /* ── Trial/Usage sync ── */
  incUsage: function() {
    if (!this.userProfile) return;
    var today = new Date().toDateString();
    var daily = this.userProfile.dailyUsage || { date: '', count: 0 };
    var dailyCount = (daily.date === today) ? daily.count + 1 : 1;
    var newTrialUsed = (this.userProfile.trialUsed || 0) + 1;

    this.userProfile.trialUsed = newTrialUsed;
    this.userProfile.dailyUsage = { date: today, count: dailyCount };

    /* Also sync localStorage for backward compat */
    localStorage.setItem('clarix_trial_used', newTrialUsed);

    /* Debounced Firestore write */
    clearTimeout(this._usageSaveTimer);
    var self = this;
    this._usageSaveTimer = setTimeout(function() {
      self.saveField('trialUsed', newTrialUsed);
      self.saveField('dailyUsage', { date: today, count: dailyCount });
    }, 2000);
  },

  canEnhance: function() {
    if (!this.userProfile) return false;
    if (this.userProfile.isPro) return true;
    var config = (typeof CLARIX_CONFIG !== 'undefined') ? CLARIX_CONFIG : { freeTrialLimit: 25, freeDailyLimit: 3 };
    if ((this.userProfile.trialUsed || 0) < config.freeTrialLimit) return true;
    var today = new Date().toDateString();
    var daily = this.userProfile.dailyUsage || { date: '', count: 0 };
    var dailyCount = (daily.date === today) ? daily.count : 0;
    return dailyCount < config.freeDailyLimit;
  },

  remainingToday: function() {
    if (!this.userProfile) return 0;
    if (this.userProfile.isPro) return Infinity;
    var config = (typeof CLARIX_CONFIG !== 'undefined') ? CLARIX_CONFIG : { freeTrialLimit: 25, freeDailyLimit: 3 };
    if ((this.userProfile.trialUsed || 0) < config.freeTrialLimit) {
      return config.freeTrialLimit - (this.userProfile.trialUsed || 0);
    }
    var today = new Date().toDateString();
    var daily = this.userProfile.dailyUsage || { date: '', count: 0 };
    var count = (daily.date === today) ? daily.count : 0;
    return Math.max(0, config.freeDailyLimit - count);
  },

  /* ── Apply user language + country-specific festivals ── */
  _applyUserSettings: function() {
    var p = this.userProfile;
    if (!p) return;
    /* Set language in LangState */
    if (typeof LangState !== 'undefined' && p.langCode) {
      LangState.set(p.langCode, p.language || 'English', p.langFlag || '🌐', p.language || 'English');
    }
    /* Load country-specific festivals into FESTIVALS global */
    var code = p.countryCode || 'DEFAULT';
    var festivals = COUNTRY_FESTIVALS_DB[code] || COUNTRY_FESTIVALS_DB['DEFAULT'];
    if (typeof FESTIVALS !== 'undefined') {
      /* Replace the global festivals array */
      FESTIVALS.length = 0;
      festivals.forEach(function(f) { FESTIVALS.push(f); });
    }
    /* Update sidebar name + photo */
    this._updateSidebarUser();
  },

  _updateSidebarUser: function() {
    var p = this.userProfile;
    if (!p) return;
    /* Update sidebar username display */
    var nameEls = document.querySelectorAll('.sidebar-username, .user-name-display, #sidebarUsername');
    nameEls.forEach(function(el) {
      el.textContent = p.name || 'Creator';
    });
    /* Update avatar photo */
    var avatarEls = document.querySelectorAll('.sidebar-avatar, .user-avatar, #sidebarAvatar');
    avatarEls.forEach(function(el) {
      if (el.tagName === 'IMG' && p.photo) {
        el.src = p.photo;
        el.onerror = function() { el.src = ''; el.style.display='none'; };
      }
    });
    /* Update country badge */
    var flagEls = document.querySelectorAll('.user-country-flag');
    flagEls.forEach(function(el) { el.textContent = p.countryFlag || ''; });
  },

  /* ── LOGIN MODAL ── */
  _showLoginModal: function() {
    if (document.getElementById('clarix-login-modal')) return;
    var self = this;
    var modal = document.createElement('div');
    modal.id = 'clarix-login-modal';
    modal.className = 'clarix-login-overlay';
    modal.innerHTML = [
      '<div class="clarix-login-box">',
        '<div class="clb-logo"><span class="clb-star">✦</span> clarix</div>',
        '<div class="clb-title">India\'s First AI Prompt Engine</div>',
        '<div class="clb-sub">Sign in to get <strong>25 free prompts</strong> — synced across all your devices.</div>',
        '<div class="clb-features">',
          '<div class="clbf-item"><span>📱</span> Works on mobile + desktop</div>',
          '<div class="clbf-item"><span>🌍</span> Personalised for your country & language</div>',
          '<div class="clbf-item"><span>🔒</span> Secure · No password needed</div>',
        '</div>',
        '<button class="clb-google-btn" id="clarixGoogleSignIn">',
          '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style="width:20px;height:20px;margin-right:10px;">',
          'Continue with Google',
        '</button>',
        '<div class="clb-terms">By signing in you agree to our <a href="/terms" target="_blank">Terms</a> & <a href="/privacy" target="_blank">Privacy Policy</a></div>',
      '</div>'
    ].join('');
    document.body.appendChild(modal);
    document.getElementById('clarixGoogleSignIn').onclick = function() {
      var btn = this;
      btn.disabled = true;
      /* Show Google logo + loading text so it looks professional */
      btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style="width:20px;height:20px;margin-right:10px;opacity:0.6;"><span style="opacity:0.7;">Opening Google…</span>';
      self.signInWithGoogle();
    };
  },

  /* ── COUNTRY ONBOARDING (after first login) ── */
  _showCountryOnboarding: function() {
    var self = this;
    var p = self.userProfile;
    var langs = COUNTRY_LANGUAGES[p.countryCode] || COUNTRY_LANGUAGES['DEFAULT'];

    /* Close existing onboarding if any */
    var existingOb = document.getElementById('onboard-overlay');
    if (existingOb) existingOb.remove();

    var modal = document.createElement('div');
    modal.id = 'clarix-country-ob';
    modal.className = 'clarix-country-ob-overlay';
    modal.innerHTML = [
      '<div class="cob-box">',
        '<div class="cob-logo"><span class="clb-star">✦</span> clarix</div>',
        '<div class="cob-welcome">👋 Welcome, ' + (p.name || 'Creator') + '!</div>',
        /* Country row */
        '<div class="cob-country-row">',
          '<span class="cob-flag" id="cobFlag">' + (p.countryFlag || '🌍') + '</span>',
          '<div>',
            '<div class="cob-country-name" id="cobCountryName">' + (p.country || 'India') + '</div>',
            '<div class="cob-country-sub">Detected location</div>',
          '</div>',
          '<button class="cob-change-btn" onclick="ClarixAuth._changeCountry()">Change</button>',
        '</div>',
        /* Language picker */
        '<div class="cob-label">Choose your preferred language</div>',
        '<div class="cob-lang-grid" id="cobLangGrid">',
          langs.map(function(l, i) {
            return '<button class="cob-lang-btn' + (i===0 ? ' active' : '') + '" onclick="ClarixAuth._selectLang(this,\'' + l + '\')">' + l + '</button>';
          }).join(''),
        '</div>',
        '<div id="cobChangeCountryRow" style="display:none;margin-top:12px">',
          '<input class="cob-country-input" id="cobCountryInput" placeholder="Enter your country name..." oninput="ClarixAuth._updateCountryInput(this.value)">',
        '</div>',
        '<button class="cob-done-btn" id="cobDoneBtn" onclick="ClarixAuth._finishCountryOb()">🚀 Start Creating</button>',
      '</div>'
    ].join('');
    document.body.appendChild(modal);
    /* Pre-select first language */
    self._selectedLangInOb = langs[0] || 'English';
  },

  _selectedLangInOb: 'English',

  _selectLang: function(btn, lang) {
    document.querySelectorAll('.cob-lang-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    this._selectedLangInOb = lang;
  },

  _changeCountry: function() {
    var row = document.getElementById('cobChangeCountryRow');
    if (row) row.style.display = 'block';
  },

  _updateCountryInput: function(val) {
    /* Simple country lookup */
    var codeMap = {
      'india':'IN','united states':'US','usa':'US','us':'US','uk':'GB','united kingdom':'GB',
      'uae':'AE','united arab emirates':'AE','dubai':'AE','saudi arabia':'SA','pakistan':'PK',
      'bangladesh':'BD','singapore':'SG','malaysia':'MY','canada':'CA','australia':'AU'
    };
    var code = codeMap[val.toLowerCase().trim()] || 'DEFAULT';
    /* Update language options */
    var langs = COUNTRY_LANGUAGES[code] || COUNTRY_LANGUAGES['DEFAULT'];
    var grid = document.getElementById('cobLangGrid');
    if (grid) {
      grid.innerHTML = langs.map(function(l, i) {
        return '<button class="cob-lang-btn' + (i===0 ? ' active' : '') + '" onclick="ClarixAuth._selectLang(this,\'' + l + '\')">' + l + '</button>';
      }).join('');
    }
    this._selectedLangInOb = langs[0] || 'English';
    /* Update displayed country */
    var nameEl = document.getElementById('cobCountryName');
    if (nameEl && val.length > 2) nameEl.textContent = val;
    this.userProfile.countryCode = code;
  },

  _finishCountryOb: function() {
    var self = this;
    var lang = self._selectedLangInOb || 'English';
    /* Map language name to code */
    var langCodeMap = {
      'Hindi':'hi','Gujarati':'gu','Marathi':'mr','Tamil':'ta','Telugu':'te',
      'Kannada':'kn','Punjabi':'pa','Bengali':'bn','Urdu':'ur','Arabic':'ar',
      'Spanish':'es','French':'fr','Malay':'ms','Chinese':'zh','English':'en',
      'Swahili':'sw','Zulu':'zu','Afrikaans':'af','Welsh':'cy','Yoruba':'yo'
    };
    var code = langCodeMap[lang] || 'en';
    var langFlagMap = {
      'Hindi':'🇮🇳','Gujarati':'🇮🇳','Marathi':'🇮🇳','Tamil':'🇮🇳','Telugu':'🇮🇳',
      'Kannada':'🇮🇳','Punjabi':'🇮🇳','Bengali':'🇧🇩','Urdu':'🇵🇰','Arabic':'🇸🇦',
      'English':'🌐','Spanish':'🇪🇸','French':'🇫🇷','Malay':'🇲🇾','Chinese':'🇨🇳'
    };

    /* Update profile */
    self.userProfile.language   = lang;
    self.userProfile.langCode   = code;
    self.userProfile.langFlag   = langFlagMap[lang] || '🌐';
    self.userProfile.onboarded  = true;
    /* Save to Firestore */
    if (self.currentUser) {
      self._db.collection('users').doc(self.currentUser.uid).update({
        language:  lang,
        langCode:  code,
        langFlag:  langFlagMap[lang] || '🌐',
        onboarded: true,
        countryCode: self.userProfile.countryCode || 'IN'
      });
    }
    /* Apply settings */
    if (typeof LangState !== 'undefined') {
      LangState.set(code, lang, langFlagMap[lang] || '🌐', lang);
    }
    localStorage.setItem('clarix_onboarded', 'true');
    localStorage.setItem('clarix_username', self.userProfile.name);
    /* Remove modal */
    var modal = document.getElementById('clarix-country-ob');
    if (modal) { modal.classList.add('hiding'); setTimeout(function() { modal.remove(); }, 400); }
    document.body.style.overflow = '';
    /* Apply country festivals */
    self._applyUserSettings();
    Toast.show('Welcome to Clarix, ' + self.userProfile.name + '! ✦', 'success', 4000);
    if (typeof Sidebar !== 'undefined') Sidebar.refresh();
  }
};
