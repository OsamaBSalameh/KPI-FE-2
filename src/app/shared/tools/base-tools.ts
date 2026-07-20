//#region isNull

import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export function isNullOrUndefined(value: any) {
    return value === null || value === undefined;
}

export function isNullOrUndefinedOrWhiteSpace(value: any) {
    let data = !(value === null || value === undefined) ? value.toString() : value
    const isWhitespace = (data || '').trim().length === 0
    return value === null || value === undefined || value === '' || isWhitespace
}

export function isDateNullOrMinimum(value: any) {
    const isNull = "0001-01-01T00:00:00"
    const isMinimum = new Date(0)

    return value == isNull || value == isMinimum
}

//#endregion


//#region Date

export function fromDateToNgDate(value: Date | undefined) {
    if (value) {
        let date = new Date(value)
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }
    return null;
}

export function fromNgDateToDate(value: NgbDateStruct | undefined): Date | undefined {
    if (value) return new Date(value.year, value.month - 1, value.day + 1)
    return undefined;
}

export function fromStringDateToNgDate(value: string | null, DELIMITER: string = '-') {
    if (value) {
        let date = value.split(DELIMITER);
        return {
            year: parseInt(date[2], 10),
            month: parseInt(date[1], 10),
            day: parseInt(date[0], 10)
        };
    }
    return null;
}

//#endregion


//#region Number

export function isNumber(val: any): boolean { return typeof val === 'number'; }

export const numberPattern = "^[0-9]*$"

//#endregion


//#region Custom Reactive Validators

export class CustomValidator extends Validators {
    static notIncluded(values: any[]): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (c.value === undefined && (isNaN(c.value)) || values.includes(c.value)) {
                return { 'valueIncluded': true }
            } return null;
        }
    }

    static checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
        let pass = group.get("password")?.value;
        let confirmPass = group.get('confirmPassword')?.value
        return pass === confirmPass ? null : { notSame: true }
    }

    static greaterThan(field: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const group = control.parent;
            const dateToCompare = fromNgDateToDate(group?.get(field)?.value)
            const controlValue = fromNgDateToDate(control?.value)

            let isLessThan = false
            if (dateToCompare != undefined && controlValue != undefined)
                isLessThan = (dateToCompare > controlValue);

            if (isLessThan) return { 'greaterThan': true }
            return null
        }
    }

    static lessThan(field: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const group = control.parent;
            const dateToCompare = fromNgDateToDate(group?.get(field)?.value)
            const controlValue = fromNgDateToDate(control?.value)

            let isLessThan = false
            if (dateToCompare != undefined && controlValue != undefined)
                isLessThan = (dateToCompare < controlValue);

            if (isLessThan) return { 'lessThan': true }
            return null
        }
    }

    static match(controlName: string, checkControlName: string): ValidatorFn {
        return (controls: AbstractControl) => {
            const control = controls.get(controlName);
            const checkControl = controls.get(checkControlName);
            if (checkControl?.errors && !checkControl.errors['matching']) return null
            if (control?.value !== checkControl?.value) {
                controls.get(checkControlName)?.setErrors({ matching: true });
                return { matching: true };
            } else return null
        };
    }

}

//#endregion


export function b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}


export interface ValidationResult {
    [key: string]: boolean;
}

export function enumToObject(enumType: any): { id: number; name: string }[] {
    let result: { id: number; name: string }[] = [];
    for (var n in enumType) {
        if (typeof enumType[n] === 'number') {
            result.push({ id: <any>enumType[n], name: n });
        }
    }

    return result
}