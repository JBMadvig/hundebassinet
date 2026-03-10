import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// export const emailValidator = () => {
//     return (control: AbstractControl): ValidationErrors | null => {
//         const value = control.value as string;
//         // Email must be a valid email address and the gmail "+" trick is allowed

//         const emailRegex = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');
//         if (!emailRegex.test(value)) {
//             return { email: true };
//         }

//         return null;
//     };
// };

export const EMAIL_ERROR_MESSAGES: Record<string, string> = {
    notString: 'Email must be text',
    missingAtSymbol: 'Email must contain an @ symbol',
    invalidLocalPart: 'Invalid characters before the @ symbol',
    missingTld: 'Email must include a domain like .com or .dk',
    invalidDomain: 'Invalid domain name',
    invalidTld: 'Top-level domain must be at least two letters',
};

const LOCAL_PART_REGEX = /^[A-Za-z0-9._%+-]+$/;
const DOMAIN_REGEX = /^[A-Za-z0-9.-]+$/;
const TLD_REGEX = /^[A-Za-z]{2,}$/;

export const emailValidator: ValidatorFn = (
    control: AbstractControl,
): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    // Collect all errors in an array to show in templates
    const errors: string[] = [];

    // Check if value is string string
    if (typeof value !== 'string') {
        errors.push(EMAIL_ERROR_MESSAGES['notString']);
        return { email: errors };
    }

    const parts = value.split('@');

    // Check if we have values before and after '@'
    if (parts.length !== 2) {
        errors.push(EMAIL_ERROR_MESSAGES['missingAtSymbol']);
    }

    const localPart = parts[0] ?? '';
    const domainPart = parts[1] ?? '';

    // Test localPart if it exists
    if (localPart && !LOCAL_PART_REGEX.test(localPart)) {
        errors.push(EMAIL_ERROR_MESSAGES['invalidLocalPart']);
    }

    const domainSections = domainPart.split('.');

    // Check if domain part has value before and after '.'
    if (domainSections.length < 2) {
        errors.push(EMAIL_ERROR_MESSAGES['missingTld']);
    }

    const tld = domainSections.at(-1) ?? '';
    const domainName = domainSections.slice(0, -1).join('.');

    // Test domainPart if it exists
    if (domainName && !DOMAIN_REGEX.test(domainName)) {
        errors.push(EMAIL_ERROR_MESSAGES['invalidDomain']);
    }

    // Test tldPart if it exists
    if (tld && !TLD_REGEX.test(tld)) {
        errors.push(EMAIL_ERROR_MESSAGES['invalidTld']);
    }

    return errors.length ? { email: errors } : null;
};

