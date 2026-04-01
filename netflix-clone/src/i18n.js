import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          hero_title: "Unlimited movies, TV shows, and more.",
          hero_subtitle: "Starts at ₱169. Cancel anytime.",
          hero_cta: "Ready to watch? Enter your email to create or restart your membership.",
          get_started: "GET STARTED",
          sign_in: "Sign In",
          email_placeholder: "Email address"
        }
      },
      tl: {
        translation: {
          hero_title: "Walang limitasyong pelikula, TV show, at iba pa.",
          hero_subtitle: "Simula sa ₱169. Kanselahin kahit kailan.",
          hero_cta: "Handa ka na bang manood? Ilagay ang iyong email para gumawa o i-restart ang iyong membership.",
          get_started: "MAGSIMULA NA",
          sign_in: "Mag-sign In",
          email_placeholder: "Email address"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;