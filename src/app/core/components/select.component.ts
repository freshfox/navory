import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output
} from "@angular/core";

import * as $ from 'jquery';
import {TranslateService} from "@ngx-translate/core";
window['jQuery'] = window['$'] = $;
//require('select2');
require('chosen-js');

@Component({
	selector: 'nvry-select',
	template: `
		<label *ngIf="label">{{ label }}</label>
		<select #s class="{{ class }}" [disabled]="disabledSet">
			<option
				*ngFor="let option of options"
				[attr.value]="getValue(option)">{{ getName(option) }}
			</option>
		</select>`,
	host: {
		'[class.nvry-focused]': 'isFocused',
	}
})
export class SelectComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

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
	private $select;
	private initialValue;
	private isFocused: boolean = false;
	private isOpen: boolean = false;

	constructor(private el: ElementRef, private translate: TranslateService) {
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
		this.updateValue();
	}

	ngAfterViewInit() {
		this.select = this.el.nativeElement.querySelector('select');

		this.$select = $(this.select).chosen({
			no_results_text: this.translate.instant('general.no-results-for'),
			disable_search: !this.enableSearchField
		});

		this.$select.change((e, params) => {
			this.selectedValue = params.selected;
			this.onChange();
		});

		this.updateValue();

		this.$select.on('chosen:showing_dropdown chosen:hiding_dropdown', function(e){
			var chosen_container = $( e.target ).next( '.chosen-container' ),
				classState = e.type == 'chosen:showing_dropdown' && dropdownExceedsBottomViewport();

			function dropdownExceedsBottomViewport(){
				var dropdown        = chosen_container.find( '.chosen-drop' ),
					dropdown_top    = dropdown.offset().top - document.documentElement.scrollTop,
					dropdown_height = dropdown.height(),
					viewport_height = document.documentElement.clientHeight;

				return dropdown_top + dropdown_height > viewport_height;
			}

			chosen_container.toggleClass( 'chosen-drop-up', classState );
		});

		let $chosenSingle = this.$select.find('.chosen-search-input');

		$chosenSingle.on('focus', () => {
			this.isFocused = true;
		});

		$chosenSingle.on('blur', () => {
			this.isFocused = false;
		});
	}

	private updateValue() {
		if (this.$select) {
			this.$select.val(this.selectedValue).trigger('chosen:updated');
		}
	}

	ngOnDestroy() {
		this.$select.chosen('destroy');
	}

	getValue(option) {
		let value = option[this.valueKey]
		return (value === undefined || value === null) ? '' : value;
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
