import {TranslateService} from "ng2-translate";
import {Injectable} from "@angular/core";
var numbro = require('numbro');

let numbroDELang = {
	langLocaleCode: 'de',
	cultureCode: 'de',
	delimiters: {
		thousands: '.',
		decimal: ','
	},
	abbreviations: {
		thousand: 'k',
		million: 'm',
		billion: 'b',
		trillion: 't'
	},
	ordinal: function () {
		return '.';
	},
	currency: {
		symbol: '€',
		position: 'postfix'
	},
	defaults: {
		currencyFormat: ',4 a'
	},
	formats: {
		fourDigits: '4 a',
		fullWithTwoDecimals: ',0.00 $',
		fullWithTwoDecimalsNoCurrency: ',0.00',
		fullWithNoDecimals: ',0 $'
	}
};
numbro.culture('de', numbroDELang);

@Injectable()
export class Formatter {

	constructor(private translate: TranslateService) {
		numbro.culture(this.translate.currentLang);
	}


	money(value: number, numberOfDecimals: number = 2, alwaysShowDecimal: boolean = true): string {
		var format = '0,0';
		format += alwaysShowDecimal ? '.' : '[.]';
		for (var i = 0; i < numberOfDecimals; i++) {
			format += '0';
		}

		if (!value || isNaN(value)) {
			value = 0;
		}

		return numbro(value).format(format);
	}

	parseMoney(formatted: string): number {
		var parsed = numbro().unformat(formatted);
		if (typeof parsed == 'undefined') {
			return 0;
		}
		return parsed;
	}

}




