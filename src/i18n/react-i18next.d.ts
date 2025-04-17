
import 'react-i18next';
import enTranslation from './locales/en/translation.json';

// This creates a type that includes all our translation structure
declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof enTranslation;
    };
  }
}
