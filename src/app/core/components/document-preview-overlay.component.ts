import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
	selector: 'nvry-document-preview-overlay',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="mx-auto py-12 origin-top transform scale-125 translate-z-0">
			<nvry-document-preview [url]="url"></nvry-document-preview>
		</div>

		<div class="fixed top-8 right-12 z-50">
			<button mat-mini-fab mat-dialog-close>
				<mat-icon>close</mat-icon>
			</button>
		</div>
	`
})
export class DocumentPreviewOverlayComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-document-preview-overlay';

	@Input() url: string;

	constructor() {
	}

	ngOnInit() {
	}
}
