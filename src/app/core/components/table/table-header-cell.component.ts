import {Component, OnInit} from '@angular/core';
import {TableColumn} from "./table-column.model";
import {Input} from "@angular/core/src/metadata/directives";
import {SortDirection} from "./sort-direction.enum";

@Component({
    selector: 'th[nvry-table-header-cell]',
    templateUrl: `
        <div class="nvry-table-header-cell__inner">
            <span>{{ name }}</span>
            <nvry-icon [name]="sortIconName" *ngIf="column.sortable && sortIconName"></nvry-icon>
        </div>
    `,
    host: {
        '[class.nvry-table-header-cell--sortable]': 'column.sortable',
        '[class.nvry-table-header-cell--sorted]': 'column.sortDirection',
        '[style.width]': 'column.width + "%"'
    }
})
export class TableHeaderCellComponent implements OnInit {

    @Input() column: TableColumn;

    constructor() {
    }

    ngOnInit() {
    }

    get name() {
        return this.column.name || this.column.prop;
    }

    get sortIconName() {
        switch (this.column.sortDirection) {
            case SortDirection.Asc:
                return 'arrow-sorted-up';
            case SortDirection.Desc:
                return 'arrow-sorted-down';
        }
        return null;
    }

}
