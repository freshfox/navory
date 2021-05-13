import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {Invoice} from '../../models/invoice';

@Component({
	selector: 'nvry-payments-income-table',
	template: `
		<mat-table [dataSource]="invoices" class="ff-table-clickable">
			<ng-container matColumnDef="number">
				<mat-header-cell *matHeaderCellDef>{{ 'general.number-abbrev' | translate }}</mat-header-cell>
				<mat-cell *matCellDef="let element"> {{element.number}} </mat-cell>
			</ng-container>

			<ng-container matColumnDef="customer">
				<mat-header-cell *matHeaderCellDef>Kunde</mat-header-cell>
				<mat-cell *matCellDef="let element">
					<span class="font-medium">{{ element.customer_name }}</span>
				</mat-cell>
			</ng-container>

			<ng-container matColumnDef="date">
				<mat-header-cell *matHeaderCellDef>Rechnungsdatum</mat-header-cell>
				<mat-cell *matCellDef="let element">
					<span class="font-medium">{{ element.date | date }}</span>
				</mat-cell>
			</ng-container>

			<ng-container matColumnDef="amount">
				<mat-header-cell *matHeaderCellDef>{{ 'general.amount' | translate }}</mat-header-cell>
				<mat-cell *matCellDef="let element" class="justify-end">
					<div class="flex space-x-2">
						<span class="text-gray-400"
							  *ngIf="element.unpaid_amount !== element.getTotalGross()">({{ element.unpaid_amount | currency }}
							übrig)</span>
						<span class="text-green-500">{{element.getTotalGross() | currency }}</span>
					</div>
				</mat-cell>
			</ng-container>

			<mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
			<mat-row *matRowDef="let row; columns: displayedColumns;" (click)="rowClicked(row)"></mat-row>
		</mat-table>
	`
})
export class PaymentsIncomeTableComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-payments-expenses-table';

	@Input() invoices: Invoice[];
	@Output() rowClick = new EventEmitter<Invoice>();

	displayedColumns = ['number', 'customer', 'amount'];

	constructor() {
	}

	ngOnInit() {
	}

	rowClicked(invoice: Invoice) {
		this.rowClick.emit(invoice);
	}
}
