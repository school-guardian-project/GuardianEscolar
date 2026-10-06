import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatch = (firstControl: string, secondControl: string): ValidatorFn => {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const passwordControl = formGroup.get(firstControl);
        const confirmPasswordControl = formGroup.get(secondControl);

        return passwordControl?.value === confirmPasswordControl?.value ? null : { passwordNoMatch: true }
    }
}