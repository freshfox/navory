import {FormGroup} from "@angular/forms";
import {ColumnMode, TableOptions, TableColumn} from "angular2-data-table";

export class Helpers {

    static validateAllFields(formGroup: FormGroup) {
        for (var i in formGroup.controls) {
            var control = formGroup.controls[i];
            control.markAsTouched();

            if(control instanceof FormGroup) {
                Helpers.validateAllFields(<FormGroup>control);
            }
        }
    }

    static getTableOptions(options: any) {
        var columns = [];
        for(let column of options.columns) {
            if(column.resizeable === undefined) {
                column.resizeable = false;
            }
            columns.push(new TableColumn(column));
        }

        let mergedOptions = new TableOptions({
            headerHeight: options.headerHeight || 'auto',
            columnMode: options.columnMode || ColumnMode.force,
            rowHeight: options.rowHeight || 'auto',
            columns: columns
        });

        return new TableOptions(mergedOptions);
    }
}
