import {Component, OnInit, HostBinding, Input, Output, EventEmitter} from '@angular/core';
import {Payment} from '../../models/payment';
import {ExpenseService} from '../../services/expense.service';
import {Expense} from '../../models/expense';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaymentService} from '../../services/payment.service';
import {Invoice} from '../../models/invoice';
import {InvoiceService} from '../../services/invoice.service';

@Component({
	selector: 'nvry-book-payment-list',
	template: `
		<div class="px-4 py-4 flex-shrink-0">
			<nvry-payment [payment]="payment" [showAmount]="'remaining'" class="mb-4"></nvry-payment>
		</div>
		<div class="px-4">
			<h2 class="text-lg font-medium dark:text-white">
				{{ type === 'expenses' ? 'Offene Ausgaben' : 'Offene Einnahmen' }}
			</h2>
		</div>
		<div class="flex-grow overflow-y-auto">
			<nvry-payments-expenses-table [expenses]="expenses$ | async" (rowClick)="associateExpense($event)" *ngIf="type === 'expenses'"></nvry-payments-expenses-table>
			<nvry-payments-income-table [invoices]="invoices$ | async" (rowClick)="associateInvoice($event)" *ngIf="type === 'income'"></nvry-payments-income-table>
		</div>
	`
})

export class BookPaymentListComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-book-payment-list flex flex-col h-full';

	@Input() payment: Payment;
	@Input() type: 'expenses' | 'income' = 'expenses';

	@Output() complete = new EventEmitter();

	expenses$: Observable<Expense[]>;
	invoices$: Observable<Invoice[]>;

	constructor(private expenseService: ExpenseService, private invoiceService: InvoiceService, private paymentService: PaymentService) {
	}

	ngOnInit() {
		this.expenses$ = this.expenseService.getExpenses()
			.pipe(map((expenses) => {
				return expenses.filter(e => !e.isFullyPaid);
			}))

		this.invoices$ = this.invoiceService.getInvoices()
			.pipe(map((invoices) => {
				return invoices.filter(i => !i.isFullyPaid && !i.draft && !i.canceled);
			}));
	}

	associateExpense(expense: Expense) {
		this.paymentService.associatePaymentWithExpense(expense.id, this.payment.id)
			.subscribe(() => {
				this.complete.next();
			});
	}

	associateInvoice(invoice: Invoice) {
		this.paymentService.associatePaymentWithInvoice(invoice.id as any, this.payment.id)
			.subscribe(() => {
				this.complete.next();
			});
	}
}
