/**
 * This validators job is to check if form controls matches the same value.
 * This is used in examples as: Confirming new password is the same with two fields.
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const matchingControlsValidator = (controlsToCompare: string[]): ValidatorFn => {
    return (group: AbstractControl): ValidationErrors | null => {
        const values = controlsToCompare.map(key => group.get(key)?.value);

        // Check all controls actually exist
        const allExist = controlsToCompare.every(key => group.get(key) !== null);
        if (!allExist) {
            console.warn('matchingControlsValidator: one or more controls not found', controlsToCompare);
            return null;
        }

        // Check all values are equal
        const allMatch = values.every(val => val === values[0]);
        return allMatch ? null : { fieldsMismatch: { fields: controlsToCompare } };
    };
};
