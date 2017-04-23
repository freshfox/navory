import {Component, Input, AfterViewInit} from "@angular/core";
var iFrameResizer = require('iframe-resizer');

@Component({
	selector: 'nvry-document-preview',
	template: `<iframe [src]="url | safe" frameborder="0"></iframe>`,
	host: {
		'class': 'document-preview'
	}
})
export class DocumentPreviewComponent implements AfterViewInit {

	@Input() url: string;

	ngAfterViewInit() {
		setTimeout(() => {
			iFrameResizer.iframeResizer({checkOrigin: false});
		}, 5000);
	}
}
