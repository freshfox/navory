import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Expense} from '../../models/expense';

@Component({
	selector: 'nvry-payments-expenses-table',
	template: `
		<mat-table [dataSource]="expenses" class="ff-table-clickable" clasS="nvry-payments-expenses-table__table">
			<ng-container matColumnDef="number">
				<mat-header-cell *matHeaderCellDef>{{ 'general.number-abbrev' | translate }}</mat-header-cell>
				<mat-cell *matCellDef="let element"> {{element.number}} </mat-cell>
			</ng-container>

			<ng-container matColumnDef="description">
				<mat-header-cell *matHeaderCellDef>Beschreibung</mat-header-cell>
				<mat-cell *matCellDef="let element">
					<span class="font-medium">{{element.description}}</span>
				</mat-cell>
			</ng-container>

			<ng-container matColumnDef="date">
				<mat-header-cell *matHeaderCellDef>Datum</mat-header-cell>
				<mat-cell *matCellDef="let element">
					<span class="font-medium">{{element.date | date }}</span>
				</mat-cell>
			</ng-container>

			<ng-container matColumnDef="amount">
				<mat-header-cell *matHeaderCellDef>{{ 'general.amount' | translate }}</mat-header-cell>
				<mat-cell *matCellDef="let element" class="justify-end">
					<div class="flex space-x-2">
						<span class="text-gray-400" *ngIf="element.unpaid_amount !== element.getAmountGross()">(-{{ element.unpaid_amount | currency }} übrig)</span>
						<span class="text-red-600">-{{element.getAmountGross() | currency }}</span>
					</div>
				</mat-cell>
			</ng-container>

			<mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
			<mat-row *matRowDef="let row; columns: displayedColumns;" (click)="rowClicked(row)"></mat-row>
		</mat-table>
	`,
})

export class PaymentsExpensesTableComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-payments-expenses-table';

	@Input() expenses: Expense[];
	@Output() rowClick = new EventEmitter<Expense>();

	displayedColumns = ['number', 'description', 'date', 'amount'];

	constructor() {
	}

	ngOnInit() {
	}

	rowClicked(expense: Expense) {
		this.rowClick.emit(expense);
	}
}
