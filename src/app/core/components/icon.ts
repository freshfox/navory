import {Component, Input} from '@angular/core';

@Component({
	selector: 'nvry-icon',
	template: `
	<svg>
		<use attr.xlink:href="images/icons.svg#{{ name }}"></use>
	</svg>`
})
export class IconComponent {
	@Input() name;
}
