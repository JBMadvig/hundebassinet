import { DeepKeys, PathValue, RemoveNull } from './utility-types';

/** Converts a decimal number to a two-character hexadecimal string. */
function dec2hex (dec: number) {
    return dec.toString(16).padStart(2, '0');
}

/** Generates a cryptographically random hex string ID of the given length (default 10). */
export function generateId (len = 10) {
    const arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
}

/** Type guard that checks if a value is neither null nor undefined. */
export function isNonNull<T>(value: T): value is RemoveNull<T> {
    return value != null;
}

/** Type guard that checks if a value is a plain object (not null, not an array). */
export function isObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** Type guard that checks if a value is a Date instance. */
export function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

/** Accesses a nested property on an object using a dot-separated path (e.g. "a.b.c").
 * Example:
 * const user = {
  name: 'Jonas',
  address: {
    city: 'Copenhagen',
    geo: {
      lat: 55.67, <-- wants this value
    },
  },
};
* then use: getDeepProp(user, 'address.geo.lat') // returns 55.67
*/
export function getDeepProp
<T extends Record<string, unknown>, U extends DeepKeys<T>>
(obj: T, path: U): PathValue<T, U> {
    const parts = path.split('.');

    return parts.reduce((acc: unknown, part) => {
        if (isObject(acc)) {
            return acc[part];
        }
        return undefined;
    }, obj) as PathValue<T, U>;
}

/** Maps over an array safely, returning an empty array if the input is undefined or empty string. */
export function safeArrayMap<T, U>(arr: T[] | '' | undefined, fn: (value: T, index: number) => U): U[] {
    if (Array.isArray(arr)) {
        return arr.map(fn);
    }

    if (arr === undefined) {
        console.warn('safeArrayMap warning: Input array is undefined, returning empty array.');
    }

    return [];
}

/** Returns the base href path (e.g. "/pos/incentory") from the document's <base> tag, without the origin. */
export function getBaseHref() {
    // i.e. http://localhost:4200/pos/inventory
    const fullBase = document.getElementsByTagName('base')[0].href;
    // Becomes /pos/inventory
    const baseHref = fullBase.replace(window.location.origin, '');
    return baseHref;
}

/** Splits an array into smaller arrays of the given chunk size. */
export const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
};
