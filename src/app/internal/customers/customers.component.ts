import {Component, OnInit, ViewChild} from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer";
import {TranslateService} from "ng2-translate";
import {TableOptions} from "../../core/components/table/table-options.model";
import {SortDirection} from "../../core/components/table/sort-direction.enum";
import {ModalComponent} from "../../core/components/modal.component";
import {CustomerEditComponent} from "./customer-edit.component";

@Component({
    selector: 'nvry-customers',
    templateUrl: 'customers.component.html'
})
export class CustomersComponent implements OnInit {

    private customers: Customer[];
    private loading = false;

    @ViewChild('editCustomerModal') private editCustomerModal: ModalComponent;

    tableOptions: TableOptions;

    constructor(private customerService: CustomerService, private translate: TranslateService) {

        this.tableOptions = new TableOptions({
            columns: [
                {name: this.translate.instant('general.number-abbrev'), prop: 'number', width: 9},
                {name: this.translate.instant('general.name'), prop: 'name', sortDirection: SortDirection.Asc},
                {name: this.translate.instant('general.email'), prop: 'email', width: 20},
                {name: this.translate.instant('general.phone'), prop: 'phone', width: 15}
            ]
        });
    }

    ngOnInit() {
        this.loading = true;
        this.customerService.getCustomers()
            .subscribe(
                (customers) => {
                    this.customers = customers;
                    this.loading = false;
                },
                (error) => {
                    // TODO
                });
    }

    createCustomer() {
        this.editCustomerModal.show();
    }

    editCustomer(customer: Customer) {
        this.editCustomerModal.show(CustomerEditComponent, { customer: customer });
    }

    onCustomerSaved(customer: Customer) {
        this.customers.push(customer);
    }

}
