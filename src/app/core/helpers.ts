import {FormGroup} from "@angular/forms";

export class Helpers {

	static validateAllFields(formGroup: FormGroup) {
		for (var i in formGroup.controls) {
			var control = formGroup.controls[i];
			control.markAsTouched();

			if (control instanceof FormGroup) {
				Helpers.validateAllFields(<FormGroup>control);
			}
		}
	}

	/**
	 * Returns a deep object given a string. zoo['animal.type']
	 * @param {object} obj
	 * @param {string} path
	 */
	static getValueDeep(obj, path) {
		if (!obj || !path) return obj;

		let current = obj;
		let split = path.split('.');

		if (split.length) {
			for (let i = 0, len = split.length; i < len; i++) {
				current = current[split[i]];
			}
		}

		return current;
	}

}
