import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import {TableOptions} from './table-options.model';
import {TableColumn} from './table-column.model';
import {SortDirection} from './sort-direction.enum';
import {Helpers} from '../../helpers';

@Component({
	selector: 'ff-table',
	template: `
		<table [class.table--clickable-items]="options.itemsClickable">
			<tr>
				<th ff-table-header-cell *ngFor="let column of options.columns" [column]="column"
					(click)="sortHeaderClicked(column)"></th>
			</tr>

			<tbody *ngIf="rows && rows.length > 0">
			<tr *ngFor="let row of rows" (click)="rowClicked(row)">
				<td *ngFor="let column of options.columns"
					[class.ff-table-cell--align-right]="column.alignment == 'right'"
					[class.ff-table-cell--align-center]="column.alignment == 'center'"
					[style.width]="column.width + '%'">

					<span *ngIf="!column.cellTemplate" class="text">{{ getColumnValue(column, row) }}</span>

					<ng-template
						*ngIf="column.cellTemplate"
						[ngTemplateOutlet]="column.cellTemplate"
						[ngTemplateOutletContext]="{ value: getColumnValue(column, row), row: row, column: column }">
					</ng-template>
				</td>
			</tr>
			</tbody>

		</table>

		<ng-content select="[empty]" *ngIf="!loading && !rows.length"></ng-content>

		<ff-spinner class="table-spinner" *ngIf="loading"></ff-spinner>
	`,
	host: {
		'class': 'ff-table'
	}

})
export class TableComponent implements OnChanges {

	@Input() rows: any[];
	@Input() options: TableOptions;
	@Input() loading: boolean;

	@Output() onRowClicked = new EventEmitter<any>();


	private sortedColumn: TableColumn;

	static switchSortDirection(column: TableColumn) {
		if (column.sortDirection === SortDirection.Asc) {
			column.sortDirection = SortDirection.Desc;
		} else {
			column.sortDirection = SortDirection.Asc;
		}
	}

	static getSortComparator(sortDirection: SortDirection, getValueFunction: (row) => {}) {
		return (rowA, rowB) => {

			const a = getValueFunction(rowA);
			const b = getValueFunction(rowB);

			if (a === b) {
				return 0;
			}

			if (sortDirection === SortDirection.Asc) {
				return a > b ? 1 : -1;
			}

			return a < b ? 1 : -1;
		}
	}

	constructor() {
	}

	ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
		for (const propName in changes) {
			if (propName === 'rows') {
				if (this.rows) {
					this.updateSorting();
				}
			}
		}
	}

	updateSorting() {
		this.options.columns.forEach((column) => {
			if (column.sortDirection) {
				this.sortColumn(column);
			}
		});
	}

	getColumnValue(column: TableColumn, row): any {
		const val = this.getValue(row, this.getPropertyName(column));
		const pipe = column.pipe;
		return pipe ? pipe.transform(val) : val;
	}

	getValue(row, propertyName) {
		return Helpers.getValueDeep(row, propertyName);
	}

	getPropertyName(column: TableColumn): string {
		return column.prop;
	}

	sortHeaderClicked(tableColumn: TableColumn) {
		if (tableColumn.sortable) {
			if (tableColumn === this.sortedColumn) {
				TableComponent.switchSortDirection(tableColumn);
			} else {
				tableColumn.sortDirection = SortDirection.Desc;
				this.sortedColumn = tableColumn;
			}

			for (const column of this.options.columns) {
				if (column != tableColumn) {
					column.sortDirection = null;
				}
			}

			this.sortColumn(tableColumn);
		}
	}

	sortColumn(column: TableColumn) {
		const propertyName = this.getPropertyName(column);
		const getValueFunction = (row) => {
			if (propertyName) {
				return this.getValue(row, propertyName);
			}
			return column.getDynamicValue(row);
		};

		const sortFunction = TableComponent.getSortComparator(column.sortDirection, getValueFunction);
		this.sortedColumn = column;
		this.rows.sort(sortFunction);
	}

	rowClicked(row) {
		if (this.options.itemsClickable) {
			this.onRowClicked.next(row);
		}
	}
}
