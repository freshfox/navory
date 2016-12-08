import {Component} from "@angular/core";
import {Input} from "@angular/core/src/metadata/directives";

@Component({
	selector: 'nvry-alert-bar',
	template: `
        <div class="alert visible" [ngClass]="getClasses()" *ngIf="message">
            <div class="msg" [innerHTML]="message"></div>
        </div>`
})
export class AlertBarComponent {
	@Input() message: string;
	@Input() type: string;

	getClasses() {
		return {
			success: this.type === 'success'
		}
	}
}
