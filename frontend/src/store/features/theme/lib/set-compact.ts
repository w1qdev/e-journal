import { saveToLocalStorage } from '@/utils/save-to-local-storage.ts';

export const setCompact = (compact: boolean) => {
    saveToLocalStorage('compact', compact);
};
