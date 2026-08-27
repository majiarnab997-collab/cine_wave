export type Locale = 'en' | 'es' | 'fr' | 'de' | 'hi';

export interface LanguageOption {
  code: Locale;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' }
];

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    nav_home: 'Home',
    nav_movies: 'Movies',
    nav_tv: 'TV Shows',
    nav_browse: 'Browse',
    nav_my_list: 'My List',
    nav_continue_watching: 'Continue Watching',
    btn_play: 'Play',
    btn_more_info: 'More Info',
    btn_add_list: 'My List',
    btn_in_list: 'In My List',
    btn_like: 'Like',
    search_placeholder: 'Search movies, TV shows, actors, genres...',
    hero_trending: '#1 in Movies Today',
    row_continue_watching: 'Continue Watching for {name}',
    row_trending: 'Trending Now',
    row_top_ten: 'Top 10 Today in Movies & TV',
    row_new_releases: 'New Releases',
    row_recommended: 'Recommended For You',
    footer_tagline: 'Ride the wave of next-generation cinematic streaming.',
    kids_mode_badge: 'KIDS MODE',
    admin_portal: 'Admin Dashboard'
  },
  es: {
    nav_home: 'Inicio',
    nav_movies: 'Películas',
    nav_tv: 'Series TV',
    nav_browse: 'Explorar',
    nav_my_list: 'Mi Lista',
    nav_continue_watching: 'Continuar viendo',
    btn_play: 'Reproducir',
    btn_more_info: 'Más información',
    btn_add_list: 'Mi Lista',
    btn_in_list: 'En Mi Lista',
    btn_like: 'Me gusta',
    search_placeholder: 'Buscar películas, series, actores, géneros...',
    hero_trending: '#1 en Películas Hoy',
    row_continue_watching: 'Continuar viendo para {name}',
    row_trending: 'Tendencias',
    row_top_ten: 'Los 10 más vistos hoy',
    row_new_releases: 'Nuevos lanzamientos',
    row_recommended: 'Recomendados para ti',
    footer_tagline: 'Súbete a la ola del streaming cinematográfico de última generación.',
    kids_mode_badge: 'MODO INFANTIL',
    admin_portal: 'Panel de Administración'
  },
  fr: {
    nav_home: 'Accueil',
    nav_movies: 'Films',
    nav_tv: 'Séries',
    nav_browse: 'Explorer',
    nav_my_list: 'Ma Liste',
    nav_continue_watching: 'Reprendre la lecture',
    btn_play: 'Regarder',
    btn_more_info: 'Plus d’infos',
    btn_add_list: 'Ma Liste',
    btn_in_list: 'Dans Ma Liste',
    btn_like: 'J’aime',
    search_placeholder: 'Rechercher des films, séries, acteurs, genres...',
    hero_trending: 'N° 1 des films aujourd’hui',
    row_continue_watching: 'Reprendre la lecture pour {name}',
    row_trending: 'Tendances actuelles',
    row_top_ten: 'Top 10 aujourd’hui',
    row_new_releases: 'Nouveautés',
    row_recommended: 'Recommandé pour vous',
    footer_tagline: 'Vivez la nouvelle vague du cinéma en streaming.',
    kids_mode_badge: 'MODE ENFANTS',
    admin_portal: 'Panneau d’administration'
  },
  de: {
    nav_home: 'Startseite',
    nav_movies: 'Filme',
    nav_tv: 'Serien',
    nav_browse: 'Durchsuchen',
    nav_my_list: 'Meine Liste',
    nav_continue_watching: 'Weiterschauen',
    btn_play: 'Abspielen',
    btn_more_info: 'Mehr Infos',
    btn_add_list: 'Meine Liste',
    btn_in_list: 'In Meiner Liste',
    btn_like: 'Gefällt mir',
    search_placeholder: 'Filme, Serien, Schauspieler, Genres suchen...',
    hero_trending: '#1 der heutigen Filme',
    row_continue_watching: 'Weiterschauen für {name}',
    row_trending: 'Jetzt im Trend',
    row_top_ten: 'Top 10 Heute',
    row_new_releases: 'Neuerscheinungen',
    row_recommended: 'Für dich empfohlen',
    footer_tagline: 'Erlebe die nächste Welle des Kinos im Streaming.',
    kids_mode_badge: 'KINDER-MODUS',
    admin_portal: 'Admin-Dashboard'
  },
  hi: {
    nav_home: 'होम',
    nav_movies: 'फिल्में',
    nav_tv: 'टीवी शो',
    nav_browse: 'ब्राउज़ करें',
    nav_my_list: 'मेरी लिस्ट',
    nav_continue_watching: 'देखना जारी रखें',
    btn_play: 'चलाएं',
    btn_more_info: 'अधिक जानकारी',
    btn_add_list: 'मेरी लिस्ट',
    btn_in_list: 'लिस्ट में शामिल',
    btn_like: 'पसंद करें',
    search_placeholder: 'फिल्में, टीवी शो, अभिनेता, शैलियां खोजें...',
    hero_trending: 'आज फिल्मों में #1',
    row_continue_watching: '{name} के लिए देखना जारी रखें',
    row_trending: 'ट्रेंडिंग',
    row_top_ten: 'आज के शीर्ष 10',
    row_new_releases: 'नई रिलीज',
    row_recommended: 'आपके लिए अनुशंसित',
    footer_tagline: 'अगली पीढ़ी की सिनेमाई स्ट्रीमिंग की लहर पर सवार हों।',
    kids_mode_badge: 'किड्स मोड',
    admin_portal: 'एडमिन डैशबोर्ड'
  }
};

export const i18nService = {
  translate(key: string, locale: Locale = 'en', params?: Record<string, string>): string {
    const dict = TRANSLATIONS[locale] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), val);
      });
    }

    return text;
  }
};
