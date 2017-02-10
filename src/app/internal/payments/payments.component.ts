import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {PaymentService} from "../../services/payment.service";
import {Payment} from "../../models/payment";
import {TableOptions} from "../../core/components/table/table-options.model";
import {TranslateService} from "ng2-translate";
import {DatePipe} from "../../core/pipes/date.pipe";
import {NumberPipe} from "../../core/pipes/number.pipe";
import {ModalService} from "../../core/modal.module";

@Component({
	selector: 'nvry-payments',
	templateUrl: '././payments.component.html'
})
export class PaymentsComponent implements OnInit {

	private payments: Payment[] = [];
	private tableOptions: TableOptions;

	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;

	constructor(private paymentService: PaymentService,
				private translate: TranslateService,
				private datePipe: DatePipe,
				private numberPipe: NumberPipe,
				private modalService: ModalService) {
	}

	ngOnInit() {
		this.tableOptions = new TableOptions({
			columns: [
				{name: this.translate.instant('general.date'), prop: 'date', width: 12, pipe: this.datePipe},
				{name: this.translate.instant('general.description'), prop: 'description'},
				{name: this.translate.instant('general.amount'), prop: 'amount', width: 10, pipe: this.numberPipe },
				{width: 5, cellTemplate: this.actionsColumn, sortable: false},
			]
		});

		this.paymentService.getPayments()
			.subscribe(payments => {
				this.payments = payments;
			})
	}

	deletePayment(payment) {
		this.modalService.createConfirmRequest(
			this.translate.instant('expenses.delete-confirm-title'),
			this.translate.instant('expenses.delete-confirm-message'),
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
