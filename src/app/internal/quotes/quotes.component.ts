import {Component, OnInit, ViewChild, TemplateRef} from "@angular/core";
import {TableOptions} from "../../core/components/table/table-options.model";
import {TranslateService} from "@ngx-translate/core";
import {SortDirection} from "../../core/components/table/sort-direction.enum";
import {Invoice, InvoiceStatus} from "../../models/invoice";
import {InvoiceService} from "../../services/invoice.service";
import {DatePipe} from "../../core/pipes/date.pipe";
import {ColumnAlignment} from "../../core/components/table/column-alignment.enum";
import {Router} from "@angular/router";
import {Calculator} from "../../core/calculator";
import {NumberPipe} from "../../lib/ffc-angular/pipes/number.pipe";
import {ModalService} from "../../lib/ffc-angular/services/modal.service";
import {Quote, QuoteStatus} from "../../models/quote.model";
import {QuoteService} from "../../services/quote.service";
var moment = require('moment');

@Component({
	selector: 'nvry-quotes',
	templateUrl: './quotes.component.html'
})
export class QuotesComponent implements OnInit {

	quotes: Quote[] = [];

	@ViewChild('statusColumn') statusColumnTpl: TemplateRef<any>;
	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
	loading: boolean = false;
	tableOptions: TableOptions;

	constructor(private translate: TranslateService,
				private quoteService: QuoteService,
				private datePipe: DatePipe,
				private numberPipe: NumberPipe,
				private router: Router,
				private modalService: ModalService) {
	}

	ngOnInit() {
		this.loading = true;
		this.quoteService.getQuotes()
			.subscribe(quotes => {
				this.loading = false;
				this.quotes = quotes as any;
			});

		this.tableOptions = new TableOptions({
			columns: [
				{
					name: this.translate.instant('invoices.status'),
					cellTemplate: this.statusColumnTpl,
					width: 12,
					getDynamicValue: this.getQuoteStatus.bind(this)
				},
				{
					name: this.translate.instant('general.number-abbrev'),
					prop: 'number',
					width: 7,
					sortDirection: SortDirection.Desc
				},
				{name: this.translate.instant('general.customer'), prop: 'customer_name', width: 30},
				{name: this.translate.instant('invoices.date-created'), prop: 'date', pipe: this.datePipe, width: 12},
				{name: this.translate.instant('general.valid-to'), prop: 'valid_to_date', pipe: this.datePipe, width: 12},
				{
					name: this.translate.instant('general.amount_net'),
					prop: 'amount',
					pipe: this.numberPipe,
					width: 15,
					alignment: ColumnAlignment.Right
				},
				{width: 4, cellTemplate: this.actionsColumn},
			]
		});
	}

	createQuote() {
		this.router.navigate(['/quotes/new']);
	}

	editQuote(quote: Quote) {
		this.router.navigate([`/quotes/${quote.id}`]);
	}

	deleteQuote(quote: Quote) {
		this.modalService.createConfirmRequest(
			this.translate.instant('quotes.delete-confirm-title'),
			this.translate.instant('quotes.delete-confirm-message'),
			() => {
				this.modalService.hideCurrentModal();
			},
			() => {
				let index = this.quotes.indexOf(quote);
				this.quotes.splice(index, 1);
				this.quoteService.deleteQuote(quote).subscribe();
				this.modalService.hideCurrentModal();
			});
	}

	getBadgeData(invoice) {
		let text;
		let badgeClass;
		switch (this.getQuoteStatus(invoice)) {
			case QuoteStatus.Draft:
				text = this.translate.instant('general.draft');
				badgeClass = 'gray';
				break;
			case QuoteStatus.Issued:
				text = this.translate.instant('general.issued');
				badgeClass = 'customer';
				break;
			default:
				break;
		}

		return {
			text: text,
			cssClass: badgeClass
		};
	}

	getQuoteStatus(quote): QuoteStatus {
		var status;
		if (quote.draft) {
			status = QuoteStatus.Draft;
		} else {
			status = QuoteStatus.Issued;
		}

		return status;
	}

	private getIssuedAmount(): number {
		return this.getQuoteAmount(QuoteStatus.Issued);
	}

	private getDraftAmount(): number {
		return this.getQuoteAmount(QuoteStatus.Draft);
	}

	private getQuoteAmount(status: QuoteStatus) {
		let amount = 0;
		this.quotes.forEach((quote) => {
			if(this.getQuoteStatus(quote) == status) {
				amount = Calculator.add(amount, quote.getTotalGross());
			}
		});

		return amount;
	}

	private getTotalAmount(): number {
		let amount = 0;
		this.quotes.forEach((quotes) => {
			amount = Calculator.add(amount, quotes.getTotalGross());
		});

		return amount;
	}
}
