import {TableColumn} from "./table-column.model";

export class TableOptions {

    columns: TableColumn[];

    constructor(props: any) {
        Object.assign(this, props);
    }
}
