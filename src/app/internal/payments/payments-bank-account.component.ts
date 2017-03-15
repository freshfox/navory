import {Component, OnInit, TemplateRef, ViewChild, Input} from "@angular/core";
import {PaymentService} from "../../services/payment.service";
import {Payment} from "../../models/payment";
import {TableOptions} from "../../core/components/table/table-options.model";
import {TranslateService} from "ng2-translate";
import {DatePipe} from "../../core/pipes/date.pipe";
import {ModalService} from "../../core/modal.module";
import {ColumnAlignment} from "../../core/components/table/column-alignment.enum";
import {SortDirection} from "../../core/components/table/sort-direction.enum";
import {BankAccount} from "../../models/bank-account";

@Component({
	selector: 'nvry-payments-bank-account',
	templateUrl: './payments-bank-account.component.html'
})
export class PaymentsBankAccountComponent implements OnInit {

	@Input() private bankAccount: BankAccount;
	private payments: Payment[] = [];
	private tableOptions: TableOptions;
	private loading: boolean = false;

	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
	@ViewChild('amountColumn') amountColumn: TemplateRef<any>;

	constructor(private paymentService: PaymentService,
				private translate: TranslateService,
				private datePipe: DatePipe,
				private modalService: ModalService) {
		console.log('HEYHO');
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
