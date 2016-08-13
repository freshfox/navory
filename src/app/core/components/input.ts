import {Component, Input} from '@angular/core';

@Component({
    selector: 'nvry-input',
    template: `
	<div class="formfield-wrapper">
        <input type="{{ type }}" placeholder="{{ placeholder }}" name="{{ name }}" id="{{ name }}">
    </div>`
})
export class InputComponent {
    @Input() name;
    @Input() placeholder = '';
    @Input() type = 'text';
}
