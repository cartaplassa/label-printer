export const capitalize = (val: string): string => {
    if (!val) return '';
    return val[0].toUpperCase() + val.slice(1);
};
