import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
	selector: 'nvry-upgrade-plan',
	template: `
		<nvry-icon name="rocket"></nvry-icon>
		
		<h2>Jetzt upgraden, um diese Funktion zu nutzen.</h2>
		
		<p>Nicht alle Funktionen in Navory sind kostenlos verfügbar. Um den vollen Umfang von Navory zu nutzen und deine Buchhaltung so einfach wie möglich zu machen, aktualisiere deinen Plan <strong>ab EUR 10,- pro Monat</strong>.</p>
		
		<nvry-button class="button--l" (click)="clickPlans()">Pläne anzeigen</nvry-button>
	`,
	host: {
		'class': 'upgrade-plan'
	}
})
export class UpgradePlanComponent implements OnInit {

	@Output() onClickPlans: EventEmitter<any> = new EventEmitter<any>();

	constructor(private router: Router) {
	}

	ngOnInit() {
	}

	clickPlans() {
		this.router.navigate(['/settings/subscription']);
		this.onClickPlans.next();
	}
}
