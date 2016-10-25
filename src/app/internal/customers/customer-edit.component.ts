import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {FormValidator} from "../../core/form-validator";
import {Customer} from "../../models/customer";
import {CustomerService} from "../../services/customer.service";
import {Helpers} from "../../core/helpers";
import {State} from "../../core/state";
import {Country} from "../../models/country";
import {TranslateService} from "ng2-translate";

@Component({
    selector: 'nvry-customer-edit',
    templateUrl: 'customer-edit.component.html'
})
export class CustomerEditComponent implements OnInit {

    private form: FormGroup;
    private loading: boolean = false;
    private countries: Country[];
    private headerText: string;

    @Input() customer: Customer;
    @Output() onSaved: EventEmitter<Customer> = new EventEmitter<Customer>();
    @Output() onCancel: EventEmitter = new EventEmitter();

    constructor(private fb: FormBuilder,
                private customerService: CustomerService,
                private state: State,
                private translate: TranslateService) {
    }

    ngOnInit() {
        this.customer = this.customer || new Customer;
        this.countries = this.state.countries;
        this.headerText = this.customer.id ? this.translate.instant('customers.edit-title') : this.translate.instant('customers.create-title');

        this.form = this.fb.group({
            name: [this.customer.name, Validators.required],
            address: [this.customer.address, Validators.required],
            number: [this.customer.number],
            email: [this.customer.email, FormValidator.email],
            phone: [this.customer.phone],
            vat_number: [this.customer.vat_number]
        });
    }

    cancel() {
        this.onCancel.next();
    }

    save() {
        Helpers.validateAllFields(this.form);
        if (this.form.valid) {
            this.loading = true;
            let data = this.form.value;
            this.customerService.saveCustomer(data)
                .subscribe(
                    customer => {
                        this.customer = customer;
                        this.onSaved.next(customer);
                    },
                    err => {
                        // TODO
                    });
        }
    }

}
