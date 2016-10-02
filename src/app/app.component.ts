import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "ng2-translate";

@Component({
    selector: 'nvry-app-root',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'app.component.html',
    styleUrls: ['../style/app.scss']
})
export class AppComponent {

    constructor(private translate: TranslateService) {
        translate.use('de');
    }
}
