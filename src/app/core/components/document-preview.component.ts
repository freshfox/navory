import {AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';

var iFrameResizer = require('iframe-resizer');

@Component({
	selector: 'nvry-document-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [
		`
			:host {
				width: 600px;
			}
		`
	],
	template: `
		<iframe [src]="url | safe" class="w-full"></iframe>
	`
})
export class DocumentPreviewComponent implements AfterViewInit {

	@Input() url: string;

	@HostBinding('class') clazz = 'mx-auto relative block w-full';

	ngAfterViewInit() {
		iFrameResizer.iframeResizer({checkOrigin: false});
	}
}
