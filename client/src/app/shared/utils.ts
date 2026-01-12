import { DeepKeys, PathValue, RemoveNull } from './utility-types';

function dec2hex (dec: number) {
    return dec.toString(16).padStart(2, '0');
}

export function generateId (len = 10) {
    const arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
}

export function isNonNull<T>(value: T): value is RemoveNull<T> {
    return value != null;
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

export function safeArrayMap<T, U>(arr: T[] | '' | undefined, fn: (value: T, index: number) => U): U[] {
    if (Array.isArray(arr)) {
        return arr.map(fn);
    }

    if (arr === undefined) {
        console.warn('safeArrayMap warning: Input array is undefined, returning empty array.');
    }

    return [];
}

export function getDeepProp<T extends Record<string, unknown>, U extends DeepKeys<T>>(obj: T, path: U): PathValue<T, U> {
    const parts = path.split('.');

    return parts.reduce((acc: unknown, part) => {
        if (isObject(acc)) {
            return acc[part];
        }
        return undefined;
    }, obj) as PathValue<T, U>;
}

export function getBaseHref() {
    // i.e. http://localhost:4200/bsp/en
    const fullBase = document.getElementsByTagName('base')[0].href;
    // Becomes /bsp/en
    const baseHref = fullBase.replace(window.location.origin, '');
    return baseHref;
}

export const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
};
