export function grams(g: number) {
    if (g >= 1000)
        return `${Number((g / 1000).toFixed(2))}kg`;

    return `${Math.max(0, g)}g`;
}
