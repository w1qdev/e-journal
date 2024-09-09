import { saveToLocalStorage } from '@/utils/save-to-local-storage.ts';
import { Theme } from '@/types/theme.types.ts';

export const setTheme = (theme: Theme) => {
    saveToLocalStorage('theme', theme);
    const html = document.querySelector('html');
    if (html) {
        html.setAttribute('data-theme', theme);
    }
};
