import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Expense} from '../../models/expense';

@Component({
	selector: 'nvry-payments-expenses-table',
	template: `
		<mat-table [dataSource]="expenses" class="ff-table-clickable">
			<ng-container matColumnDef="number">
				<mat-header-cell *matHeaderCellDef>{{ 'general.number-abbrev' | translate }}</mat-header-cell>
				<mat-cell *matCellDef="let element"> {{element.number}} </mat-cell>
			</ng-container>
			<ng-container matColumnDef="amount">
				<mat-header-cell *matHeaderCellDef>{{ 'general.amount' | translate }}</mat-header-cell>
				<mat-cell *matCellDef="let element">
					<span class="text-red-600">-{{element.price | ffNumber }}</span>
				</mat-cell>
			</ng-container>

			<mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
			<mat-row *matRowDef="let row; columns: displayedColumns;" (click)="rowClicked(row)"></mat-row>
		</mat-table>
	`
})

export class PaymentsExpensesTableComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-payments-expenses-table';

	@Input() expenses: Expense[];

	displayedColumns = ['number', 'amount'];

	constructor() {
	}

	ngOnInit() {
	}

	rowClicked(expense: Expense) {
		// TODO
	}
}
