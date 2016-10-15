import {TableColumn} from "./table-column.model";

export class TableOptions {

    columns: TableColumn[];
    itemsClickable: boolean = true;

    constructor(props: any) {
        var columns = [];
        for(let column of props.columns) {
            columns.push(new TableColumn(column));
        }

        props.columns = columns;

        Object.assign(this, props);
    }
}
