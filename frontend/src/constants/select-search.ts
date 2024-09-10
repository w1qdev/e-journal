export const selectSearch = {
    showSearch: true,
    filterOption: (input: any, option: any) =>
        option?.label.toLowerCase().includes(input.toLowerCase()),
};
