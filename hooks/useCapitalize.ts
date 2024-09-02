export const capitalize = ((name: string) => {
    const word = String(name)
    return word.charAt(0).toUpperCase() + word.slice(1);
});