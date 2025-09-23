import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import i18n from "../i18n";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "ur", label: "اردو" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "as", label: "অসমীয়া" },
  { code: "ks", label: "کٲشُر" },
  { code: "sd", label: "سنڌي" },
  { code: "sa", label: "संस्कृतम्" },
  { code: "ne", label: "नेपाली" },
  { code: "mai", label: "मैथिली" },
  { code: "doi", label: "डोगरी" },
  { code: "bho", label: "भोजपुरी" },
  { code: "gom", label: "कोंकणी" },
  { code: "mni-Mtei", label: "Meitei (Manipuri)" },
  { code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" }
];

const setLang = (code) => {
  const iframe = document.querySelector("iframe.goog-te-menu-frame");
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = code;
    select.dispatchEvent(new Event("change"));
  } else if (iframe) {
    const innerSelect = iframe.contentDocument?.querySelector(".goog-te-combo");
    if (innerSelect) {
      innerSelect.value = code;
      innerSelect.dispatchEvent(new Event("change"));
    }
  }
  try { localStorage.setItem("shaktix_lang", code); } catch (_) {}
  try { document.documentElement.setAttribute("lang", code); } catch (_) {}
};

// Load Google Translate script on-demand if not present and wait for widget to render
const ensureGoogleReady = () => {
  return new Promise((resolve) => {
    const hasSelect = () => document.querySelector('.goog-te-combo');
    if (hasSelect()) return resolve(true);

    // If script already present, wait until widget appears
    const existing = document.querySelector('script[src*="translate_a/element.js"]');
    if (!existing) {
      const initName = 'googleTranslateElementInit';
      // Ensure init function exists
      if (!window[initName]) {
        window[initName] = function() {
          // no-op; widget will render using existing code in index.html if present
        };
      }
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    let tries = 0;
    const timer = setInterval(() => {
      if (hasSelect() || tries > 100) {
        clearInterval(timer);
        resolve(!!hasSelect());
      }
      tries += 1;
    }, 100);
  });
};

const LanguageSwitcher = () => {
  const location = useLocation();

  useEffect(() => {
    // Ensure Google widget exists, then sync stored language
    const stored = (() => { try { return localStorage.getItem("shaktix_lang"); } catch (_) { return null; } })();
    ensureGoogleReady().then(() => { if (stored) setLang(stored); });
  }, []);

  // Re-apply translation on route change so newly rendered content is translated
  useEffect(() => {
    const stored = (() => { try { return localStorage.getItem("shaktix_lang"); } catch (_) { return null; } })();
    if (stored) setTimeout(() => setLang(stored), 50);
  }, [location.pathname]);

  return (
    <div className="lang-switch">
      <select
        aria-label="Select language"
        defaultValue={(typeof window !== 'undefined' && localStorage.getItem('shaktix_lang')) || 'en'}
        onChange={async (e) => {
          const code = e.target.value;
          i18n.changeLanguage(code);
          const ready = await ensureGoogleReady();
          if (ready) setLang(code);
          else setLang(code); // still set local and lang attribute as fallback
        }}
      >
        {LANGS.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;


