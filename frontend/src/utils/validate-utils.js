import {elements} from "chart.js";

export class ValidateUtils {
    static findElements(elements) {
        elements.forEach(fieldElement => {
            fieldElement.element = document.getElementById(fieldElement.id);
        });
        return elements;
    }

    static validateForm(elements) {
        let isValid = true;
        elements.forEach(fieldElement => {
            let validElement = true;
            if (fieldElement.hasOwnProperty('validation')) {
                if (fieldElement.validation.hasOwnProperty('regex')) {
                    if (!fieldElement.element.value || !fieldElement.element.value.match(fieldElement.validation.regex)) {
                        fieldElement.element.classList.add('is-invalid');
                        validElement = false;
                    } else {
                        fieldElement.element.classList.remove('is-invalid');
                    }
                }
                if (fieldElement.validation.hasOwnProperty('compare')) {
                    const compareValue = elements.find(item => item.name === fieldElement.validation.compare).element.value;
                    if (!compareValue || fieldElement.element.value !== compareValue) {
                        validElement = false;
                        fieldElement.element.classList.add('is-invalid');
                    } else {
                        fieldElement.element.classList.remove('is-invalid');
                    }
                }
                if (fieldElement.validation.hasOwnProperty('selectIndex')) {
                    const compareValue=fieldElement.element.value;
                    if (!compareValue.match(fieldElement.validation.selectIndex)) {
                        fieldElement.element.classList.add('is-invalid');
                        validElement = false;
                    }else{
                        fieldElement.element.classList.remove('is-invalid');
                    }
                }
                fieldElement.valid = validElement;
                !validElement ? isValid = false : null;
            }
        });
        return isValid;
    }

    static validateElement(element) {
        let isValid = true;
        if (!element.hasOwnProperty('validation')) {
            return isValid;
        }
        if (element.validation.hasOwnProperty('regex')) {
            if (!element.element.value || !element.element.value.match(element.validation.regex)) {
                element.element.classList.add('is-invalid');
                isValid = false;
            } else {
                element.element.classList.remove('is-invalid');
            }
        }
        if (element.validation.hasOwnProperty('compare')) {
            const compareElement = document.getElementById(element.validation.compare);
            const compareValue = compareElement ? compareElement.value : null;
            if (!compareValue || element.element.value !== compareValue) {
                isValid = false;
                element.element.classList.add('is-invalid');
            } else {
                element.element.classList.remove('is-invalid');
            }
        }
        isValid ? element.element.classList.add('is-valid') : element.element.classList.remove('is-valid');
        return isValid;
    }
}