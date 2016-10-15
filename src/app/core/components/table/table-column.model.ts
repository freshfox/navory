
import {SortDirection} from "./sort-direction.enum";
import {PipeTransform} from "@angular/core";
export class TableColumn {

    cellTemplate: any;
    name: string;
    prop: string;
    sortable: boolean = true;
    sortDirection: SortDirection;
    pipe: PipeTransform;

    constructor(props: any) {
        Object.assign(this, props);
    }
}
