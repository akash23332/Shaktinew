import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Base English strings
const enTranslations = {
  brand: 'SHAKTIX',
  nav: { home: 'Home', services: 'Services', about: 'About Us', contact: 'Contact Us', signup: 'Sign Up', login: 'Login', editProfile: 'Edit Profile', logout: 'Logout' },
  hero: { title1: 'ShaktiX: Empowering Women', title2: 'Through', highlight: 'AI & Blockchain', subtitle: 'Your Guardian in Health, Safety, and Digital Security', cta: 'LEARN MORE' },
  index: { servicesHeading: 'Your Guardian in a Fragmented World' },
  auth: { login: 'Login', signup: 'Create Account', email: 'Email', password: 'Password', name: 'Full Name', phone: 'Phone Number', otp: 'Enter OTP', signin: 'Sign In', signupCta: 'Sign Up', haveAccount: 'Already have an account?', noAccount: "Don't have an account?" },
  contact: { heading: 'Get in Touch', subtitle: "We’d love to hear from you. Let's build a safer future together.", send: 'Send Message', hint: 'We typically reply within 24 hours. Your information is kept confidential.' }
};

// Hindi strings
const hiTranslations = {
  brand: 'शक्तिX',
  nav: { home: 'होम', services: 'सेवाएँ', about: 'हमारे बारे में', contact: 'संपर्क करें', signup: 'साइन अप', login: 'लॉगिन', editProfile: 'प्रोफ़ाइल संपादित करें', logout: 'लॉगआउट' },
  hero: { title1: 'शक्तिX: महिलाओं को सशक्त बनाना', title2: 'के माध्यम से', highlight: 'एआई और ब्लॉकचेन', subtitle: 'स्वास्थ्य, सुरक्षा और डिजिटल सुरक्षा में आपका संरक्षक', cta: 'और जानें' },
  index: { servicesHeading: 'खंडित दुनिया में आपका संरक्षक' },
  auth: { login: 'लॉगिन', signup: 'खाता बनाएं', email: 'ईमेल', password: 'पासवर्ड', name: 'पूरा नाम', phone: 'फोन नंबर', otp: 'ओटीपी दर्ज करें', signin: 'साइन इन', signupCta: 'साइन अप', haveAccount: 'क्या आपके पास खाता है?', noAccount: 'क्या आपके पास खाता नहीं है?' },
  contact: { heading: 'संपर्क करें', subtitle: 'हम आपसे सुनना पसंद करेंगे। आइए मिलकर एक सुरक्षित भविष्य बनाएं।', send: 'संदेश भेजें', hint: 'हम आमतौर पर 24 घंटे के भीतर जवाब देते हैं। आपकी जानकारी गोपनीय रहती है।' }
};

// Languages listed in the switcher
const languageCodes = [
  'en','hi','bn','te','mr','ta','ur','gu','kn','ml','pa','or','as','ks','sd','sa','ne','mai','doi','bho','gom','mni-Mtei','sat'
];

// Build resources: real translations for en/hi, English fallback for others for now
const resources = languageCodes.reduce((acc, code) => {
  if (code === 'en') acc[code] = { translation: enTranslations };
  else if (code === 'hi') acc[code] = { translation: hiTranslations };
  else acc[code] = { translation: enTranslations };
  return acc;
}, {});

const stored = (() => { try { return localStorage.getItem('shaktix_lang') || 'en'; } catch (_) { return 'en'; } })();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: stored,
    fallbackLng: 'en',
    supportedLngs: languageCodes,
    interpolation: { escapeValue: false }
  });

export default i18n;


