import {Component, OnInit, Input, EventEmitter, Output} from "@angular/core";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {FormValidator} from "../../core/form-validator";
import {Customer} from "../../models/customer";
import {CustomerService} from "../../services/customer.service";
import {Helpers} from "../../core/helpers";
import {State} from "../../core/state";
import {Country} from "../../models/country";
import {TranslateService} from "@ngx-translate/core";
import {ErrorHandler} from "../../core/error-handler";
import {BootstrapService} from "../../services/bootstrap.service";

@Component({
	selector: 'nvry-customer-edit',
	templateUrl: './customer-edit.component.html'
})
export class CustomerEditComponent implements OnInit {

	form: FormGroup;
	loading: boolean = false;
	countries: Country[];
	headerText: string;
	alertMessage: string;
	selectedCountryCode: string;

	@Input() customer: Customer;
	@Output() onSaved: EventEmitter<Customer> = new EventEmitter<Customer>();
	@Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

	constructor(private fb: FormBuilder,
				private customerService: CustomerService,
				private bootstrapService: BootstrapService,
				private state: State,
				private translate: TranslateService,
				private errorHandler: ErrorHandler) {
	}

	ngOnInit() {
		this.countries = this.state.countries;

		this.form = this.fb.group({
			name: ["", Validators.required],
			address: [""],
			number: [""],
			email: ["", FormValidator.email],
			phone: [""],
			vat_number: [""]
		});

		this.customer = this.customer ? Object.assign({}, this.customer) : new Customer;
		this.selectedCountryCode = this.customer.country_code || this.bootstrapService.getDefaultCountry().code;
		this.headerText = this.customer.id ? this.translate.instant('customers.edit-title') : this.translate.instant('customers.create-title');
	}

	cancel() {
		this.onCancel.next();
	}

	save() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			this.loading = true;
			this.customer.country_code = this.selectedCountryCode;
			this.customerService.saveCustomer(this.customer)
				.subscribe(
					customer => {
						this.loading = false;
						this.customer = customer;
						this.onSaved.next(Object.assign({}, this.customer));
					},
					err => {
						this.loading = false;
						this.alertMessage = this.errorHandler.getDefaultErrorMessage(err.code);
					});
		}
	}

}
