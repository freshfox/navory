import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'nvry-badge',
	template: `
		<span clasS="badge__text">{{ text }}</span>
	`,
	host: {
		'[class]': 'classNames',
	}
})

export class BadgeComponent implements OnInit {

	@Input() type: string;
	@Input() text: string;
	@Input() class: string;

	constructor() {
	}

	ngOnInit() {
	}

	get classNames(): string {
		return `badge badge--${this.type} ${this.class}`;
	}
}
