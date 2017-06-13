import {Injectable} from "@angular/core";

@Injectable()
export class ValidationMessageProviderImpl {

	getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
		let config = {
			'required': 'Dies ist ein Pflichtfeld',
			'invalidEmailAddress': 'Ungültige E-Mail Adresse',
			'passwordsNotEqual': 'Passwörter stimmen nicht überein.',
			'minlength': `Mindestlänge ${validatorValue.requiredLength} Zeichen`,
			'invalidDate': 'Bitte gib ein korrektes Datum ein',
			'userWithEmailExists': 'Ein Benutzer mit dieser E-Mail Adresse ist bereits in unserem System vorhanden.',
			'notNumeric': 'Bitte gib eine Zahl ein',
			numberNotUnique: 'Diese Nummer ist bereits belegt.'
		};

		return config[validatorName] || 'No error message for type ' + validatorName;
	}

}
