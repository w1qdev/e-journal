import { loadFromLocalStorage } from '@/utils/load-from-local-storage.ts';

export const loadCompact = () => {
    const compact = loadFromLocalStorage('compact');
    return !!compact;
};
