import {Component, Input} from '@angular/core';

@Component({
	selector: 'nvry-icon',
	template: `
	<svg>
		<use attr.xlink:href="#icon-{{ name }}"></use>
	</svg>`
})
export class IconComponent {
	@Input() name;
}
