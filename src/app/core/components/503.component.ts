import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";

@Component({
	selector: 'nvry-503',
	template: `
        
        <div class="frame timeout-page">
            <div class="bit-100">
                <span class="status-code">503</span>
                <div class="text">
                    <h1 [innerHTML]="'timeout.text' | translate"></h1>
                </div>
                <nvry-button [loading]="refreshing" (click)="onRefresh()">
                    {{ 'timeout.button' | translate }}
                </nvry-button>
            </div>
        </div>
`
})
export class FiveZeroThreeComponent implements OnInit {

	private refreshing: boolean = false;

	constructor(private location: Location) {
	}

	ngOnInit() {
		this.location.replaceState('/');
	}

	onRefresh() {
		this.refreshing = true;
		window.location.href = '';
	}

}
