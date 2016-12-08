import {Component} from "@angular/core";
import {TranslateService} from "ng2-translate";

@Component({
	selector: 'nvry-app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	constructor(private translate: TranslateService) {
		translate.use('de');
	}
}
