import {Component, OnInit, ViewChild, TemplateRef} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {DatePipe} from "../../core/pipes/date.pipe";
import {Router} from "@angular/router";
import {Calculator} from "../../core/calculator";
import {NumberPipe} from "../../lib/ffc-angular/pipes/number.pipe";
import {Quote, QuoteStatus} from "../../models/quote.model";
import {QuoteService} from "../../services/quote.service";
import {ColumnAlignment, DialogService, SortDirection, TableOptions} from '@freshfox/ng-core';
var moment = require('moment');

@Component({
	selector: 'nvry-quotes',
	templateUrl: './quotes.component.html'
})
export class QuotesComponent implements OnInit {

	quotes: Quote[] = [];

	@ViewChild('statusColumn', { static: true }) statusColumnTpl: TemplateRef<any>;
	@ViewChild('actionsColumn', { static: true }) actionsColumn: TemplateRef<any>;
	loading: boolean = false;
	tableOptions: TableOptions;

	constructor(private translate: TranslateService,
				private quoteService: QuoteService,
				private datePipe: DatePipe,
				private numberPipe: NumberPipe,
				private router: Router,
				private dialogService: DialogService) {
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
		this.dialogService.createConfirmRequest(
			this.translate.instant('quotes.delete-confirm-title'),
			this.translate.instant('quotes.delete-confirm-message'),
			null,
			null
		).subscribe((confirmed) => {
			if (confirmed) {
				let index = this.quotes.indexOf(quote);
				this.quotes.splice(index, 1);
				this.quoteService.deleteQuote(quote).subscribe();
			}
		});
	}

	getBadgeData(invoice) {
		let text;
		let type;
		switch (this.getQuoteStatus(invoice)) {
			case QuoteStatus.Draft:
				text = this.translate.instant('general.draft');
				type = 'gray';
				break;
			case QuoteStatus.Issued:
				text = this.translate.instant('general.issued');
				type = 'info_alt';
				break;
			default:
				break;
		}

		return {
			text: text,
			type: type
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
