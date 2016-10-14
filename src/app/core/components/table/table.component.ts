import {Component, OnInit} from '@angular/core';
import {Input} from "@angular/core/src/metadata/directives";
import {TableOptions} from "./table-options.model";
import {TableColumn} from "./table-column.model";
import {SortDirection} from "./sort-direction.enum";

@Component({
    selector: 'nvry-table',
    templateUrl: `
    <table>
        <tr>
            <th nvry-table-header-cell *ngFor="let column of options.columns" [column]="column" (click)="sortColumn(column)"></th>
        </tr>
        
        <tbody *ngIf="rows && rows.length > 0">
            <tr *ngFor="let row of rows">
                <td *ngFor="let column of options.columns">
                    {{ getColumnValue(column, row) }}
                </td>
            </tr>
        </tbody>
    </table>
    
    <nvry-spinner class="table-spinner" *ngIf="loading"></nvry-spinner>
    `
})
export class TableComponent implements OnInit {

    @Input() rows: any[];
    @Input() options: TableOptions;
    @Input() loading: boolean;

    private sortedColumn: TableColumn;

    constructor() {
    }

    ngOnInit() {
    }

    getColumnValue(column: TableColumn, row): any {
        return row[this.getPropertyName(column)];
    }

    getPropertyName(column: TableColumn): string {
        return column.prop || column.name;
    }

    sortColumn(tableColumn: TableColumn) {
        if(tableColumn.sortable) {
            if(tableColumn == this.sortedColumn) {
                TableComponent.switchSortDirection(tableColumn);
            } else {
                tableColumn.sortDirection = SortDirection.desc;
                this.sortedColumn = tableColumn;
            }

            for(let column of this.options.columns) {
                if(column != tableColumn) {
                    column.sortDirection = null;
                }
            }

            let propertyName = this.getPropertyName(tableColumn);
            this.rows.sort(TableComponent.getSortComparator(tableColumn.sortDirection, propertyName));
        }
    }

    static switchSortDirection(column: TableColumn) {
        if(column.sortDirection === SortDirection.asc) {
            column.sortDirection = SortDirection.desc;
        } else {
            column.sortDirection = SortDirection.asc;
        }
    }

    static getSortComparator(sortDirection: SortDirection, propertyName: string) {
        return (modelA, modelB) => {

            let a = modelA[propertyName];
            let b = modelB[propertyName];

            if(a === b) {
                return 0;
            }

            if(sortDirection == SortDirection.asc) {
                return a > b ? 1 : -1;
            }

            return a < b ? 1 : -1;
        }
    }

}
