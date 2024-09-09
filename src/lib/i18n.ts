import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('$assets/i18n/en.json'));
register('es', () => import('$assets/i18n/es.json'));

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator()
});
