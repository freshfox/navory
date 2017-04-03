import {Component, Input} from "@angular/core";

@Component({
	selector: 'nvry-icon',
	template: `
	<svg>
		<use attr.xlink:href="/assets/images/icons.svg#{{ name }}"></use>
	</svg>`,
	host: {
		'class': 'icon'
	}
})
export class IconComponent {
	@Input() name;
}
