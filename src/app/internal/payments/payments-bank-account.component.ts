import {Component, OnInit, TemplateRef, ViewChild, Input} from "@angular/core";
import {PaymentService} from "../../services/payment.service";
import {Payment} from "../../models/payment";
import {TranslateService} from "@ngx-translate/core";
import {DatePipe} from "../../core/pipes/date.pipe";
import {BankAccount} from "../../models/bank-account";
import {ModalService} from "../../lib/ffc-angular/services/modal.service";
import {TableOptions} from '../../lib/ffc-angular/components/table/table-options.model';
import {SortDirection} from '../../lib/ffc-angular/components/table/sort-direction.enum';
import {ColumnAlignment} from '../../lib/ffc-angular/components/table/column-alignment.enum';

@Component({
	selector: 'nvry-payments-bank-account',
	templateUrl: './payments-bank-account.component.html'
})
export class PaymentsBankAccountComponent implements OnInit {

	@Input() private bankAccount: BankAccount;
	payments: Payment[] = [];
	tableOptions: TableOptions;
	loading: boolean = false;

	@ViewChild('actionsColumn', { static: true }) actionsColumn: TemplateRef<any>;
	@ViewChild('amountColumn', { static: true }) amountColumn: TemplateRef<any>;

	constructor(private paymentService: PaymentService,
				private translate: TranslateService,
				private datePipe: DatePipe,
				private modalService: ModalService) {
	}

	ngOnInit() {
		this.tableOptions = new TableOptions({
			itemsClickable: false,
			columns: [
				{name: this.translate.instant('general.description'), prop: 'description'},
				{
					name: this.translate.instant('general.date'),
					prop: 'date', width: 12,
					pipe: this.datePipe,
					sortDirection: SortDirection.Desc
				},
				{
					name: this.translate.instant('general.amount'),
					cellTemplate: this.amountColumn,
					prop: 'amount',
					width: 10,
					alignment: ColumnAlignment.Right
				},
				{width: 4, cellTemplate: this.actionsColumn, sortable: false},
			]
		});
	}

	ngOnChanges() {
		this.loading = true;
		this.paymentService.getPayments(this.bankAccount.id)
			.subscribe(payments => {
				this.payments = payments;
				this.loading = false;
			})
	}

	deletePayment(payment) {
		this.modalService.createConfirmRequest(
			this.translate.instant('payments.delete-confirm-title'),
			this.translate.instant('payments.delete-confirm-message'),
			() => {
				this.modalService.hideCurrentModal();
			},
			() => {
				let index = this.payments.indexOf(payment);
				this.payments.splice(index, 1);
				this.paymentService.deletePayment(payment).subscribe();
				this.modalService.hideCurrentModal();
			});
	}

}
