import { THEMES } from '@/constants/themes.ts';
import { loadFromLocalStorage } from '@/utils/load-from-local-storage.ts';

export const loadTheme = () => {
    let theme = loadFromLocalStorage('theme');
    if (!THEMES.some((i) => i.id === theme)) theme = 'light';

    const html = document.querySelector('html');
    if (html) {
        html.setAttribute('data-theme', theme);
    }

    return theme;
};
