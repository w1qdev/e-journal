export const loadFromLocalStorage = (key: string) => {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue !== null) {
            return JSON.parse(serializedValue);
        }
    } catch (e) {
        console.error(`Ошибка при загрузке из localStorage: ${e}`);
    }
};
