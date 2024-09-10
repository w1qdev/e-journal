export const saveToLocalStorage = (key: string, value: unknown) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (e) {
        console.error(`Ошибка при сохранении в localStorage: ${e}`);
    }
};
