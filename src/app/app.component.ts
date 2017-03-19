import {Component} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {environment} from "../environments/environment";

@Component({
	selector: 'nvry-app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	constructor(private translate: TranslateService) {
		translate.use('de');

		this.initIntercom();
	}

	private initIntercom() {
		if(environment.production) {
			(window as any).Intercom("boot", {
				app_id: environment.intercomAppId
			});
		}
	}
}
