import {TableColumn} from './table-column.model';

export class TableOptions {

	columns: TableColumn[];
	itemsClickable = true;

	constructor(props: any) {
		const columns = [];
		for (const column of props.columns) {
			columns.push(new TableColumn(column));
		}

		props.columns = columns;

		Object.assign(this, props);
	}
}
