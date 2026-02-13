import { AbstractControl, ValidationErrors } from '@angular/forms';

export const emailValidator = () => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string;
        // Email must be a valid email address and the gmail "+" trick is allowed

        // eslint-disable-next-line no-useless-escape
        const emailRegex = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');
        if (!emailRegex.test(value)) {
            return { email: true };
        }

        return null;
    };
};
