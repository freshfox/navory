import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {FormValidator} from "../../core/form-validator";
import {Customer} from "../../models/customer";
import {CustomerService} from "../../services/customer.service";
import {Helpers} from "../../core/helpers";
import {State} from "../../core/state";
import {Country} from "../../models/country";
import {TranslateService} from "ng2-translate";
import {ErrorHandler} from "../../core/error-handler";

@Component({
    selector: 'nvry-customer-edit',
    templateUrl: 'customer-edit.component.html'
})
export class CustomerEditComponent implements OnInit {

    private form: FormGroup;
    private loading: boolean = false;
    private countries: Country[];
    private headerText: string;
    private alertMessage: string;
    private selectedCountryId: number;

    @Input() customer: Customer;
    @Output() onSaved: EventEmitter<Customer> = new EventEmitter<Customer>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    constructor(private fb: FormBuilder,
                private customerService: CustomerService,
                private state: State,
                private translate: TranslateService,
                private errorHandler: ErrorHandler) {
    }

    ngOnInit() {
        this.countries = this.state.countries;
    }

    ngOnChanges() {
        this.customer = this.customer ? Object.assign({}, this.customer) : new Customer;
        this.headerText = this.customer.id ? this.translate.instant('customers.edit-title') : this.translate.instant('customers.create-title');

        this.form = this.fb.group({
            name: ["", Validators.required],
            address: [""],
            number: [""],
            email: ["", FormValidator.email],
            phone: [""],
            vat_number: [""]
        });

        this.selectedCountryId = this.customer.country_id || this.state.getAustria().id;
    }

    cancel() {
        this.onCancel.next();
    }

    save() {
        Helpers.validateAllFields(this.form);
        if (this.form.valid) {
            this.loading = true;
            this.customer.country_id = this.selectedCountryId;
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
