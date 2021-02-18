import {Component, OnInit, HostBinding, Input} from '@angular/core';
import {Payment} from '../../models/payment';
import {ExpenseService} from '../../services/expense.service';
import {Expense} from '../../models/expense';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'nvry-book-payment-list',
	template: `
		<div class="px-4 py-4">
			<nvry-payment [payment]="payment"></nvry-payment>
		</div>
		<nvry-payments-expenses-table [expenses]="expenses$ | async"></nvry-payments-expenses-table>
	`
})

export class BookPaymentListComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-book-payment-list';

	@Input() payment: Payment;
	@Input() type: 'expenses' | 'income' = 'expenses';

	expenses$: Observable<Expense[]>;

	constructor(private expenseService: ExpenseService) {
	}

	ngOnInit() {
		this.expenses$ = this.expenseService.getExpenses()
			.pipe(map((expenses) => {
				return expenses.filter(e => !e.isFullyPaid);
			}))
	}
}
