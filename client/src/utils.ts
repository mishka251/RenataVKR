export function parseNbsp(text: string): string {
    return text.replace(new RegExp('&nbsp;', 'g'), '\u00A0');
}