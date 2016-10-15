import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "ng2-translate";
var numbro = require('numbro');
import {numbro} from "numbro";


let deLang = {
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

numbro.culture('de', deLang);

@Pipe({name: 'nvryNumber'})
export class NumberPipe implements PipeTransform {

    constructor(private translate: TranslateService) {
        numbro.culture(this.translate.currentLang);
    }

    transform(value: number, numberOfDecimals: number = 2): string {
        var format = '0,0.';
        for (var i = 0; i < numberOfDecimals; i++) {
            format += '0';
        }

        if(!value) {
            value = 0;
        }

        return numbro(value).format(format);
    }
}
