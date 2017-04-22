import {Component, ComponentRef, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ModalService} from "../../core/modal.module";
import {SubscriptionFormComponent} from "./subscription-form.component";
import {TableOptions} from "../../core/components/table/table-options.model";
import {TranslateService} from "ng2-translate";
import {DatePipe} from "../../core/pipes/date.pipe";
import {ColumnAlignment} from "../../core/components/table/column-alignment.enum";
import {NumberPipe} from "../../core/pipes/number.pipe";
import {Invoice} from "../../models/invoice";

@Component({
	selector: 'nvry-subscription',
	templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {


	yearly: boolean = true;
	planActive: boolean = true;

	invoiceTableOptions: TableOptions;
	invoices: Invoice[] = [];
	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;

	constructor(private modalService: ModalService, private translate: TranslateService, private datePipe: DatePipe, private numberPipe: NumberPipe) {

	}

	ngOnInit() {
		this.invoiceTableOptions = new TableOptions({
			columns: [
				{name: this.translate.instant('general.date'), prop: 'date', pipe: this.datePipe, width: 12},
				{
					name: this.translate.instant('general.amount_net'),
					prop: 'amount',
					pipe: this.numberPipe,
					width: 15,
					alignment: ColumnAlignment.Right
				},
				{width: 20, cellTemplate: this.actionsColumn},
			]
		});
	}

	openPaymentModal() {
		this.modalService.create(SubscriptionFormComponent, null, false)
			.subscribe((ref: ComponentRef<SubscriptionFormComponent>) => {
				ref.instance.onSuccess.subscribe(() => {
					this.modalService.hideCurrentModal();
					this.planActive = true;
				});
			});
	}

	get proPrice(): number {
		return this.yearly ? 10 : 12;
	}

	downloadInvoice(invoice) {
		// TODO
	}
}
