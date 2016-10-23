
import {SortDirection} from "./sort-direction.enum";
import {PipeTransform} from "@angular/core";
import {ColumnAlignment} from "./column-alignment.enum";
export class TableColumn {

    cellTemplate: any;
    name: string;
    prop: string;
    sortable: boolean = true;
    sortDirection: SortDirection;
    pipe: PipeTransform;
    width: number;
    alignment: ColumnAlignment;

    constructor(props: any) {
        Object.assign(this, props);
    }
}
