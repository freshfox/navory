import {Component, OnInit, EventEmitter, ElementRef, Input, Output} from "@angular/core";
var $ = require('jquery');
require('select2');

@Component({
	selector: 'nvry-select',
	template: `
        <label *ngIf="label">{{ label }}</label>
        <select (change)="onChange()" #s [(ngModel)]="selectedValue" class="{{ class }}" [disabled]="disabledSet">
           <option 
           *ngFor="let option of options" 
           [attr.value]="getValue(option)">{{ getName(option) }}</option>
        </select>`
})
export class SelectComponent implements OnInit {

	@Input() options: any;
	@Input() valueKey: string = 'id';
	@Input() nameKey: string = 'name';
	@Input() class: string;

	@Input()
	public set disabled(value: any) {
		this.disabledSet = true;
	}

	@Input() selectedValue: any;
	@Output() selectedValueChange = new EventEmitter<any>();

	@Input() label: string;

	@Input() enableSearchField: boolean = true;

	disabledSet: boolean = false;
	private select;
	private select2Element;
	private initialValue;

	constructor(private el: ElementRef) {
	}

	ngOnInit() {
		var emit: boolean = false;
		if (this.selectedValue) {
			this.initialValue = this.selectedValue;
		} else {
			this.initialValue = this.getValueForIndex(0);
			emit = true;
		}

		setTimeout(() => {
			this.selectedValue = this.initialValue;
			if (emit) {
				this.selectedValueChange.emit(this.initialValue);
			}
		}, 1);
	}

	ngOnChanges() {
		if (this.select2Element) {
			this.select2Element.val(this.selectedValue).trigger('change');
		}
	}

	ngAfterViewInit() {
		this.select = this.el.nativeElement.querySelector('select');

		let minimumResults = this.enableSearchField ? 1 : -1;
		this.select2Element = $(this.select).select2({
			minimumResultsForSearch: minimumResults
		});

		this.select2Element.val(this.initialValue).trigger('change');

		this.select2Element.on('select2:select', (e: Event) => {
			this.selectedValue = this.select.value;
			this.onChange();
		});
	}

	ngOnDestroy() {
		this.select2Element.off("select2:select");
		$(this.select).select2('destroy');
	}

	getValue(option) {
		let value = option[this.valueKey]
		return value !== undefined ? value : '';
	}

	private getValueForIndex(index: number) {
		return this.getValue(this.options[index]);
	}

	getName(option) {
		return option[this.nameKey] || this.getValue(option);
	}

	onChange() {
		this.selectedValueChange.emit(this.selectedValue);
	}

}
