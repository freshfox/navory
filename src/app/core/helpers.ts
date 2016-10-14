import {FormGroup} from "@angular/forms";
import {TableColumn} from "./components/table/table-column.model";
import {TableOptions} from "./components/table/table-options.model";

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
            columns.push(new TableColumn(column));
        }

        options.columns = columns;

        return new TableOptions(options);
    }
}
