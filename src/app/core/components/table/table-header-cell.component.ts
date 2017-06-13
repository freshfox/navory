import {Component, Input, OnInit} from "@angular/core";
import {TableColumn} from "./table-column.model";
import {SortDirection} from "./sort-direction.enum";

@Component({
	selector: 'th[nvry-table-header-cell]',
	template: `
        <div class="nvry-table-header-cell__inner">
            <span>{{ name }}</span>
            <ff-icon [name]="sortIconName" [attr.invisible]="!(column.sortable && sortIconName) ? true : null"></ff-icon>
        </div>
    `,
	host: {
		'[class.nvry-table-header-cell--sortable]': 'column.sortable',
		'[class.nvry-table-header-cell--sorted]': 'column.sortDirection',
		'[style.width]': 'column.width + "%"',
		'[class.nvry-table-cell--align-right]': 'column.alignment == "right"',
		'[class.nvry-table-cell--align-center]': 'column.alignment == "center"'
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
