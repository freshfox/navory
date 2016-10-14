
import {SortDirection} from "./sort-direction.enum";
export class TableColumn {

    cellTemplate: any;
    name: string;
    prop: string;
    sortable: boolean = true;
    sortDirection: SortDirection;

    constructor(props: any) {
        Object.assign(this, props);
    }
}
